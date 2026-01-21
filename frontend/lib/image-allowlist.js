// Single source of truth for allowed external image hosts
const ALLOWED_IMAGE_HOSTS = [
  "www.bing.com",
  "s3.amazonaws.com",
  // Supabase Storage for uploaded files
  // Note: project-specific domain is usually <project-ref>.supabase.co
  // We allow any supabase project by checking hostname endsWith('.supabase.co') in isHostAllowed
  // allow any subdomain of s3.amazonaws.com, checks use endsWith
]

function isHostAllowed(hostname) {
  if (!hostname || typeof hostname !== "string") return false
  const h = hostname.toLowerCase()
  if (ALLOWED_IMAGE_HOSTS.includes(h)) return true
  if (h.endsWith(".s3.amazonaws.com")) return true
  if (h.endsWith(".supabase.co")) return true
  return false
}

module.exports = {
  ALLOWED_IMAGE_HOSTS,
  isHostAllowed,
}
