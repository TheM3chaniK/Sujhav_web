import fs from "fs";
import path from "path";
import { google } from "googleapis";

const DOCKER_SECRET_PATH = "/run/secrets/google_service_account";

// Root-level ./secrets folder (sibling of /app)
const LOCAL_SECRET_PATH = path.join(
  process.cwd(),
  "secrets",
  "google-service-account.json"
);

export function getGoogleAuth() {
  // 1️⃣ Docker secret (prod / VM)
  if (fs.existsSync(DOCKER_SECRET_PATH)) {
    return new google.auth.GoogleAuth({
      keyFile: DOCKER_SECRET_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  // 2️⃣ Local root-level ./secrets folder
  if (fs.existsSync(LOCAL_SECRET_PATH)) {
    return new google.auth.GoogleAuth({
      keyFile: LOCAL_SECRET_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  // 3️⃣ Env fallback (optional)
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ?.replace(/\\n/g, "\n")
    ?.replace(/^"(.*)"$/, "$1");

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !privateKey) {
    throw new Error(
      "Google credentials not found: /run/secrets or ./secrets or env"
    );
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

