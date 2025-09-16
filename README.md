# IBIZAGYM

Projet complet — Frontend (Next.js + Tailwind), Backend (Supabase SQL + RLS), API (portique webhook), Mobile (Expo React Native).

**Contenu**
- frontend/ : Next.js app (public planning, admin pages)
- sql/ : SQL scripts to run in Supabase
- api/ : Next API routes (example portique webhook)
- mobile/ : Expo app for members
- .env.example : variables d'environnement à remplir

**How to run**
1. Create a Supabase project and copy `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
2. Run the SQL in `sql/schema.sql` in Supabase SQL Editor.
3. In `frontend/`:
   - copy `.env.example` to `.env.local` and fill with your Supabase values.
   - `npm install`
   - `npm run dev`
4. In `mobile/`:
   - copy `.env.example` to `.env` and fill values for Supabase
   - `npm install`
   - `expo start`

**Security**
- Never commit `SUPABASE_SERVICE_ROLE_KEY` to public repos.
- Protect `/api/portique` by HMAC signature or IP allowlist.

