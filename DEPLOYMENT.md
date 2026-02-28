# Deployment Guide: ধরিয়ে দে (Dhoriye De)

## 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** and paste the contents of `SCHEMA.sql`.
3. Go to **Storage**, create a new bucket named `evidence`, and make it **Public**.
4. Go to **Project Settings > API** and copy your `URL` and `anon public key`.

## 2. Environment Variables
Add these to your AI Studio Secrets or `.env` file:
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
- `VITE_HCAPTCHA_SITE_KEY`: (Optional) Your hCaptcha site key.

## 3. Local Development
```bash
npm install
npm run dev
```

## 4. Production Build
```bash
npm run build
npm start
```

## 5. Security Notes
- IP hashing is done server-side in `server.ts` to prevent spoofing.
- RLS (Row Level Security) is enabled on Supabase to ensure data integrity.
- For production, consider adding a moderation dashboard to update report statuses from `pending` to `verified`.
