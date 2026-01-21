import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import pkg from "@/lib/image-allowlist"
const { isHostAllowed } = pkg

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Validate an image URL against the centralized allowlist
// Returns { isValid: boolean, error: string|null }
export function validateImageUrl(url) {
  if (!url || typeof url !== "string" || url.trim() === "") {
    // allow empty (optional images)
    return { isValid: true, error: null };
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch (err) {
    return { isValid: false, error: "Invalid URL format" };
  }

  // Allow http during development (localhost) for easier testing
  if (parsed.protocol !== "https:") {
    if (process.env.NODE_ENV !== "production") {
      // allow http, but only for localhost or 127.0.0.1
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        // permitted in dev
      } else {
        return { isValid: false, error: "Image URL must use https in production" };
      }
    } else {
      return { isValid: false, error: "Image URL must use https" };
    }
  }

  const hostname = parsed.hostname.toLowerCase();

  if (isHostAllowed(hostname)) {
    return { isValid: true, error: null };
  }

  return { isValid: false, error: `Host not allowed: ${hostname}` };
}

// Validate an array of image URLs. Returns { isValid: boolean, errors: Array<{index:number,message:string}> }
export function validateMultipleImageUrls(urls) {
  const errors = [];
  if (!Array.isArray(urls)) {
    return { isValid: false, errors: [{ index: -1, message: "Images must be an array" }] };
  }

  urls.forEach((u, i) => {
    const res = validateImageUrl(u);
    if (!res.isValid) {
      errors.push({ index: i, message: res.error || "Invalid image URL" });
    }
  });

  return { isValid: errors.length === 0, errors };
}
