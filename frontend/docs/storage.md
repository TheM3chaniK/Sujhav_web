# Supabase Storage Configuration Guide

This document describes how to create and configure the `sujhav` bucket used by the admin upload API and how to configure environment variables so the server uses the correct bucket.

## Recommended bucket settings (Supabase Storage)

1. Create a bucket named `sujhav` (this must match the `SUPABASE_DEFAULT_BUCKET` environment variable).
2. Public or private:
   - For convenience, make the bucket public so files are accessible via the `getPublicUrl` path. This is OK for images and public assets.
   - For protected assets, keep the bucket private and use signed URLs or server-side proxy.
3. CORS
   - Add a CORS policy allowing your frontend origin (e.g., `https://yourdomain.com`) for GET/POST as needed.
4. Cache control
   - When uploading images, the server will set `cacheControl: "public, max-age=31536000, immutable"` so assets are cached aggressively.

## Step-by-Step: Creating the sujhav Bucket (Supabase UI)

1. Log in to your Supabase project dashboard at https://supabase.com and select your project.
2. Navigate to Storage → Buckets in the left sidebar.
3. Click the "New bucket" button.
4. Enter the bucket name: `sujhav` (Supabase bucket names must be lowercase and may contain a–z, 0–9, and hyphens; they are case-sensitive and must match exactly).
5. Toggle "Public bucket" based on your needs (recommended: public for images and public assets).
6. Click "Create bucket" to finalize.
7. Verify the bucket appears in the buckets list.

Note: If you choose a private bucket, you'll need to configure policies and use signed URLs or server-proxied downloads for secure access.

## Environment Variable Configuration


- `SUPABASE_DEFAULT_BUCKET` (optional) — the default bucket slug used by the admin upload API when the client doesn't provide one. Example:

```
SUPABASE_DEFAULT_BUCKET=sujhav
```

- `SUPABASE_SERVICE_ROLE_KEY` — the Supabase service role key (server-only). Keep this secret and do not commit it to source control.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public Supabase client config for browser code.

The upload API (`app/api/admin/upload/route.js`) uses `process.env.SUPABASE_DEFAULT_BUCKET` as the fallback bucket when the `bucket` FormData field is not provided. The server helper defaults to the value of `SUPABASE_DEFAULT_BUCKET` (if set).

## Security

- The admin upload endpoint uses a server-side Supabase client built with the Service Role key; ensure `SUPABASE_SERVICE_ROLE_KEY` is only available on the server (Vercel/Railway environment variables UI).
- Do NOT commit service role keys to source control.

## Usage

- Admin POST `/api/admin/upload` with `FormData` fields:
   - `file` (File)
   - `bucket` (optional, defaults to `process.env.SUPABASE_DEFAULT_BUCKET` or `sujhav`)
   - `folder` (optional, default `general`)

If you do provide a `bucket` value in the form data, it must exactly match an existing bucket slug in your Supabase project.

## Notes
- If using private buckets, change the upload logic to return signed URLs instead of public URLs.

## Troubleshooting

### Error: Bucket not found

Symptoms: Upload fails with an error like:

```
{ statusCode: '404', error: 'Bucket not found', message: 'Bucket not found' }
```

Common causes and fixes:

1. Bucket name mismatch (case-sensitive). Check that the bucket slug in Supabase exactly matches the value you use in code or in the `SUPABASE_DEFAULT_BUCKET` env var. Bucket names must be lowercase (a–z), digits (0–9), and hyphens.
2. Bucket not created in the correct project. Confirm you're using the Supabase project that contains the `sujhav` bucket.
3. `SUPABASE_DEFAULT_BUCKET` is not set or incorrect in `.env`. Add or update it:

```
SUPABASE_DEFAULT_BUCKET=sujhav
```

4. The server is using a different Supabase project than the admin UI (mismatched `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`). Ensure these env vars point to the same project where you created the bucket.
5. Restart your development server after changing `.env` so new vars are loaded.
6. Optionally, if your project exposes a debug endpoint to list buckets, use it while signed in as an admin to confirm the exact slug. The exact path and availability depend on the project and may vary.

### Error: Access denied

- If you see permission errors when fetching or removing files, check bucket policies and Supabase RLS. For public buckets, read access is granted; for private buckets you must generate signed URLs or use the service role client to access files server-side.

### Error: File upload fails silently or with unknown error

- Check file size limits: images are limited to 10MB and PDFs to 50MB by default in the admin upload route.
- Check CORS rules on your Supabase project if you upload directly from the browser (uploads in this system go through the server endpoint which uses the service role key, so CORS is often not the issue).
- Inspect server logs for the exact Supabase error message — the server logs the underlying error details when uploads fail.

- ## Verification checklist

- [ ] Bucket named `sujhav` exists in Supabase Storage
- [ ] `.env` file contains `SUPABASE_DEFAULT_BUCKET=sujhav`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set in `.env`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set in `.env`
- [ ] Bucket is set to public (or private with appropriate policies)
- [ ] CORS is configured if accessing from different domains
- [ ] Development server has been restarted after environment variable changes


