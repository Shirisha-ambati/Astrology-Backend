import express from "express";
import axios from "axios";
import { geocodePlace, getAccessToken, toIsoDateTime, validateBirthDetails } from "./astrology.js";

const router = express.Router();
const MATCHING_URL = "https://api.prokerala.com/v2/astrology/kundli-matching/advanced";

function person(input, label) {
  const value = input?.[label] || {};
  return {
    name: value.name?.trim(),
    dob: value.dob?.trim(),
    birthTime: value.birthTime?.trim(),
    place: value.place?.trim(),
  };
}

router.post("/", async (req, res) => {
  const bride = person(req.body, "bride");
  const groom = person(req.body, "groom");
  const fields = {
    ...Object.fromEntries(Object.entries(validateBirthDetails({ ...bride, fullName: bride.name })).map(([key, value]) => [`bride.${key}`, value])),
    ...Object.fromEntries(Object.entries(validateBirthDetails({ ...groom, fullName: groom.name })).map(([key, value]) => [`groom.${key}`, value])),
  };

  if (!bride.name) fields["bride.name"] = "Bride name is required.";
  if (!groom.name) fields["groom.name"] = "Groom name is required.";
  if (Object.keys(fields).length) return res.status(400).json({ error: "Please correct the highlighted birth details.", fields });

  try {
    const [brideLocation, groomLocation, token] = await Promise.all([
      geocodePlace(bride.place),
      geocodePlace(groom.place),
      getAccessToken(),
    ]);
    const response = await axios.get(MATCHING_URL, {
      params: {
        ayanamsa: 1,
        girl_coordinates: `${brideLocation.latitude},${brideLocation.longitude}`,
        girl_dob: toIsoDateTime(bride.dob, bride.birthTime),
        boy_coordinates: `${groomLocation.latitude},${groomLocation.longitude}`,
        boy_dob: toIsoDateTime(groom.dob, groom.birthTime),
        la: "en",
      },
      headers: { Authorization: `Bearer ${token}` },
      timeout: 20_000,
    });
    res.json(response.data);
  } catch (error) {
    const status = error.status || error.response?.status;
    console.error("Kundli matching failed:", error.response?.data || error.message);
    res.status(status && status < 500 ? status : 502).json({
      error: error.source === "geocoding" ? error.message : "Unable to match Kundli right now. Please try again.",
    });
  }
});

export default router;
