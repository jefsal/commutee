# Commutee

Find SFSU carpool companions. Drivers can post trips, passengers can request to join, and contact info is shared after acceptance.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_ALLOW_PASSWORD_LOGIN=true
```

Notes:
- `NEXT_PUBLIC_ALLOW_PASSWORD_LOGIN=true` enables password auth for dev to avoid email rate limits. Remove for production.
- Magic link callback route: `/auth/callback`

## Supabase setup

Redirect URLs in Supabase Auth:
- `http://localhost:3000/auth/callback`
- `https://your-domain.com/auth/callback`

Run the one-time migration in Supabase SQL editor:

```
supabase_migrations_2026_02_15_add_contact_fields.sql
```

Recommended RLS policies on `profiles` (drivers/passengers can see accepted members):
- `drivers_can_read_accepted_passenger_profiles`
- `accepted_members_can_read_each_other_profiles`
- `accepted_passengers_can_read_driver_profile`

## Core flows

- Driver posts trip and accepts/declines requests
- Passenger requests to join and sees status
- Contact info visible only after acceptance (email visible by default)
