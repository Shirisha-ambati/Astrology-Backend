import express from "express";
import axios from "axios";
import https from "node:https";
import { attachKundliCookie, saveKundliRecord } from "../services/kundliStore.js";

const router = express.Router();

// This makes it unambiguous which router module a running server loaded.
console.log(`[VedAura] Loaded astrology router from ${import.meta.url}`);

async function getAccessToken() {
  const response = await axios.post(
    "https://api.prokerala.com/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.PROKERALA_CLIENT_ID,
      client_secret: process.env.PROKERALA_CLIENT_SECRET,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data.access_token;
}

const PROKERALA_KUNDLI_URL = "https://api.prokerala.com/v2/astrology/kundli";
const PROKERALA_CHART_URL = "https://api.prokerala.com/v2/astrology/chart";
const KUNDLI_TIMEZONE = process.env.KUNDLI_TIMEZONE || "Asia/Kolkata";
const GEOCODING_TIMEOUT_MS = 10_000;
const PLACE_SEARCH_CACHE_TTL_MS = 5 * 60 * 1000;
const placeSearchCache = new Map();
const geocodingHttpsAgent = new https.Agent({ family: 4, keepAlive: true });

function getRequestInput(req) {
  return req.method === "GET" ? req.query : req.body;
}

function validateBirthDetails({ fullName, dob, birthTime, place, gender }) {
  const errors = {};

  if (!fullName?.trim()) errors.fullName = "Full name is required.";
  if (!dob) errors.dob = "Date of birth is required.";
  if (!birthTime) errors.birthTime = "Birth time is required.";
  if (!place?.trim()) errors.place = "Birth place is required.";
  if (gender && !["male", "female", "other"].includes(gender.toLowerCase())) {
    errors.gender = "Gender must be male, female, or other.";
  }

  if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    errors.dob = "Date of birth must use YYYY-MM-DD format.";
  }
  if (birthTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(birthTime)) {
    errors.birthTime = "Birth time must use 24-hour HH:MM format.";
  }

  return errors;
}

function toIsoDateTime(dob, birthTime, timeZone = KUNDLI_TIMEZONE) {
  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = birthTime.split(":").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    throw new Error("Date of birth is not valid.");
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(utcDate);
  const values = Object.fromEntries(
    parts.filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value]),
  );
  const zonedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );
  const offsetMinutes = Math.round((zonedAsUtc - utcDate.getTime()) / 60000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const offset = `${sign}${String(Math.floor(absoluteOffset / 60)).padStart(2, "0")}:${String(absoluteOffset % 60).padStart(2, "0")}`;

  return `${dob}T${birthTime}:00${offset}`;
}

function buildLocation(latitude, longitude, displayName) {
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude) || !displayName) {
    return null;
  }

  return { latitude: parsedLatitude, longitude: parsedLongitude, displayName };
}

function formatPlaceDisplayName(location) {
  const address = location.address || {};
  const city = address.city || address.town || address.village || address.municipality || address.county;
  const state = address.state || address.state_district;
  const parts = [city, state, address.country].filter(Boolean);
  return [...new Set(parts)].join(", ") || location.display_name;
}

async function searchPlaces(query) {
  const cacheKey = query.trim().toLocaleLowerCase();
  const cached = placeSearchCache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < PLACE_SEARCH_CACHE_TTL_MS) {
    return cached.results;
  }

  const response = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: { q: query, format: "jsonv2", addressdetails: 1, limit: 5 },
    headers: {
      "User-Agent": "VedAura-Kundli-Geocoder/1.0 (+https://vedaura.local)",
      Accept: "application/json",
      "Accept-Language": "en",
      Referer: "http://localhost:5173/",
    },
    timeout: GEOCODING_TIMEOUT_MS,
    httpsAgent: geocodingHttpsAgent,
  });
  const results = (response.data || []).map((location) => ({
    displayName: formatPlaceDisplayName(location),
    latitude: location.lat,
    longitude: location.lon,
  }));

  placeSearchCache.set(cacheKey, { createdAt: Date.now(), results });
  return results;
}

function requestUrl(config) {
  const url = axios.getUri(config);
  return url.replace(/([?&]api_key=)[^&]+/i, "$1[REDACTED]");
}

async function requestGeocodingProvider(provider, config) {
  console.info(`[Geocoding:${provider}] requested place:`, config.params.q);
  console.info(`[Geocoding:${provider}] request URL:`, requestUrl(config));

  try {
    const response = await axios.request(config);
    console.info(`[Geocoding:${provider}] response status:`, response.status);
    console.info(`[Geocoding:${provider}] response body:`, response.data);
    return response;
  } catch (error) {
    console.error(`[Geocoding:${provider}] axios error code:`, error.code);
    console.error(`[Geocoding:${provider}] axios error message:`, error.message);
    console.error(`[Geocoding:${provider}] axios response data:`, error.response?.data);
    console.error(`[Geocoding:${provider}] axios response headers:`, error.response?.headers);
    throw error;
  }
}

async function geocodeWithNominatim(place) {
  const response = await requestGeocodingProvider("Nominatim", {
    method: "GET",
    url: "https://nominatim.openstreetmap.org/search",
    params: { q: place, format: "jsonv2", limit: 1, addressdetails: 1 },
    headers: {
      "User-Agent": "VedAura-Kundli-Geocoder/1.0 (+https://vedaura.local)",
      Accept: "application/json",
      "Accept-Language": "en",
      Referer: "http://localhost:5173/",
    },
    timeout: GEOCODING_TIMEOUT_MS,
    httpsAgent: geocodingHttpsAgent,
  });
  const location = response.data?.[0];
  return buildLocation(location?.lat, location?.lon, location?.display_name);
}

async function geocodeWithMapsCo(place) {
  const params = { q: place };
  if (process.env.GEOCODE_MAPS_CO_API_KEY) {
    params.api_key = process.env.GEOCODE_MAPS_CO_API_KEY;
  }

  const response = await requestGeocodingProvider("Maps.co", {
    method: "GET",
    url: "https://geocode.maps.co/search",
    params,
    headers: { Accept: "application/json", "User-Agent": "VedAura-Kundli-Geocoder/1.0" },
    timeout: GEOCODING_TIMEOUT_MS,
    httpsAgent: geocodingHttpsAgent,
  });
  const location = response.data?.[0];
  return buildLocation(location?.lat, location?.lon, location?.display_name);
}

async function geocodeWithPhoton(place) {
  const response = await requestGeocodingProvider("Photon", {
    method: "GET",
    url: "https://photon.komoot.io/api/",
    params: { q: place, limit: 1, lang: "en" },
    headers: { Accept: "application/json", "User-Agent": "VedAura-Kundli-Geocoder/1.0" },
    timeout: GEOCODING_TIMEOUT_MS,
    httpsAgent: geocodingHttpsAgent,
  });
  const feature = response.data?.features?.[0];
  const [longitude, latitude] = feature?.geometry?.coordinates || [];
  const properties = feature?.properties || {};
  const displayName = [properties.name, properties.city, properties.state, properties.country]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");
  return buildLocation(latitude, longitude, displayName);
}

async function geocodePlace(place) {
  const providers = [geocodeWithNominatim, geocodeWithMapsCo, geocodeWithPhoton];
  const failures = [];

  for (const provider of providers) {
    try {
      const location = await provider(place);
      if (location) return location;

      const noResultError = new Error("Provider returned no matching location.");
      noResultError.provider = provider.name;
      failures.push(noResultError);
    } catch (error) {
      // Keep the original Axios error intact for diagnostics and the final error chain.
      failures.push(error);
    }
  }

  const error = new AggregateError(
    failures,
    "We could not look up that birth place. Please try a city and country.",
  );
  error.status = 502;
  error.source = "geocoding";
  throw error;
}

// Existing route
router.get("/token", async (req, res) => {
  try {
    const token = await getAccessToken();

    res.json({
      access_token: token,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to get access token",
    });
  }
});

router.get("/places", async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (query.length < 2) {
    return res.status(400).json({ error: "Search text must contain at least 2 characters." });
  }

  try {
    res.json(await searchPlaces(query));
  } catch (error) {
    console.error("Place search failed:", error.response?.data || error.message);
    res.status(502).json({ error: "Unable to search places right now. Please try again." });
  }
});

async function generateKundli(req, res) {
  const input = getRequestInput(req) || {};
  const fullName = input.fullName?.trim();
  const dob = input.dob?.trim();
  const birthTime = input.birthTime?.trim();
  const place = input.place?.trim();
  const latitude = input.latitude;
  const longitude = input.longitude;
  const gender = input.gender?.trim().toLowerCase();
  const validationErrors = validateBirthDetails({ fullName, dob, birthTime, place, gender });

  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({ error: "Please correct the highlighted birth details.", fields: validationErrors });
  }

  try {
    const selectedLocation = buildLocation(latitude, longitude, place);
    const [location, token] = await Promise.all([
      selectedLocation ? selectedLocation : geocodePlace(place),
      getAccessToken(),
    ]);
    const datetime = toIsoDateTime(dob, birthTime);
    const coordinates = `${location.latitude},${location.longitude}`;
    const requestParams = { ayanamsa: 1, coordinates, datetime, la: "en" };
    const response = await axios.get(PROKERALA_KUNDLI_URL, {
      params: requestParams,
      headers: { Authorization: `Bearer ${token}` },
      timeout: 20_000,
    });

    // The Kundli endpoint is a summary. Rasi and Bhava charts add the actual
    // placements and houses needed by the deterministic prediction rules.
    // These requests use the same OAuth token and birth details—no new user input.
    const chartRequest = (chart_type) => axios.get(PROKERALA_CHART_URL, {
      params: { ...requestParams, chart_type },
      headers: { Authorization: `Bearer ${token}` },
      timeout: 20_000,
    });
    const [rasiResult, bhavaResult] = await Promise.allSettled([
      chartRequest("rasi"),
      chartRequest("bhava"),
    ]);
    const chartData = {
      rasi: rasiResult.status === "fulfilled" ? rasiResult.value.data : null,
      bhava: bhavaResult.status === "fulfilled" ? bhavaResult.value.data : null,
    };
    const chartWarnings = [rasiResult, bhavaResult]
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason?.response?.data?.error || result.reason?.message || "Chart data was unavailable.");

    const kundli = {
      ...response.data,
      chartData,
      chartWarnings,
      birthDetails: {
        fullName,
        dob,
        birthTime,
        place: location.displayName,
        gender: gender || null,
        coordinates,
        datetime,
      },
    };
    const kundliId = await saveKundliRecord(kundli);
    attachKundliCookie(res, kundliId);
    res.json(kundli);
  } catch (error) {
    const status = error.status || error.response?.status;
    const message =
      status === 400
        ? error.message
        : error.source === "geocoding"
          ? error.message
        : error.code === "ECONNABORTED"
          ? "The birth-place lookup timed out. Please try again."
          : "Unable to generate the Kundli right now. Please try again.";
    console.error("Kundli generation failed:", error.response?.data || error.message);

    res.status(status && status < 500 ? status : 502).json({
      error: message,
    });
  }
}

router.get("/kundli", generateKundli);
router.post("/kundli", generateKundli);

router.get("/test", (req, res) => {
  res.json({ message: "Astrology router is working" });
});
export { getAccessToken, geocodePlace, toIsoDateTime, validateBirthDetails };
export default router;
