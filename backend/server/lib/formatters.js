/**
 * Shared data formatters — convert database rows to frontend-friendly camelCase.
 * Used by controllers to ensure consistent response shapes across all endpoints.
 */

export function formatPanditRegistration(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    fullName: row.full_name || '',
    gender: row.gender || '',
    dob: row.dob || '',
    profilePhoto: row.profile_photo || '',
    mobile: row.mobile || '',
    email: row.email || '',
    city: row.city || '',
    state: row.state || '',
    country: row.country || '',
    address: row.address || '',
    experience: row.experience || '',
    specialization: row.specialization || '',
    languages: row.languages || '',
    bio: row.bio || '',
    services: row.services || [],
    certifications: row.certifications || [],
    availableDays: row.available_days || [],
    timeSlots: row.time_slots || '',
    mode: row.mode || '',
    price: row.price || '',
    freeConsultation: row.free_consultation || '',
    username: row.username || '',
    idProof: row.id_proof || '',
    selfie: row.selfie || '',
    upiId: row.upi_id || '',
    bankAccount: row.bank_account || '',
    ifscCode: row.ifsc_code || '',
    status: row.status || 'pending',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function formatAdmin(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    username: row.username,
  };
}

export function formatUser(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    email: row.email,
    phone: row.phone || '',
    fullName: row.full_name || '',
  };
}

export function formatPanditBrief(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    fullName: row.full_name || '',
    email: row.email || '',
    mobile: row.mobile || '',
    specialization: row.specialization || '',
  };
}

export function formatContactSubmission(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    message: row.message || '',
    createdAt: row.created_at,
  };
}

export function formatUserListItem(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    email: row.email || '',
    phone: row.phone || '',
    fullName: row.full_name || '',
    createdAt: row.created_at,
  };
}
