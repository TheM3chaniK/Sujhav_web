/** @type {import('next').NextConfig} */
import pkg from "./lib/image-allowlist.js"
const { ALLOWED_IMAGE_HOSTS } = pkg

// Convert allowlist to Next.js remotePatterns entries. We keep pathname loose to allow
// various object key paths in S3 or other hosts.
const remotePatterns = ALLOWED_IMAGE_HOSTS.map((host) => ({
  protocol: "https",
  hostname: host,
  port: "",
  pathname: "/**",
}))

// Add a wildcard rule for s3 subdomains (since ALLOWED_IMAGE_HOSTS contains s3.amazonaws.com)
remotePatterns.push({ protocol: "https", hostname: "*.s3.amazonaws.com", port: "", pathname: "/**" })
// Add a wildcard rule for Supabase project domains
if (!remotePatterns.some((r) => r.hostname === "*.supabase.co")) {
  remotePatterns.push({ protocol: "https", hostname: "*.supabase.co", port: "", pathname: "/**" })
}

const nextConfig = {
  // Configure remote images that Next/Image is allowed to optimize/serve.
  images: {
    remotePatterns,
  },
}

export default nextConfig;

/*
Notes and security considerations:
- `remotePatterns` whitelists allowed external image sources that Next.js Image can optimize and serve.
- Wildcards are used for flexibility (e.g., different S3 bucket subdomains). Only allow hosts you trust.
- If you rely on other domains in the future, add explicit entries here instead of broad wildcards where possible.
- See Next.js docs for details: https://nextjs.org/docs/api-reference/next/image#remote-patterns
*/
