# Commutee 24-Hour MVP Plan

## Goal
Deliver a working MVP where:
- [ ] Drivers can post trips, see requests, accept/decline, and delete trips
- [ ] Passengers can browse trips, request to join, and see status
- [ ] Contact info is visible to all accepted trip members with visibility controls

## Hard cuts (out of scope)
- [ ] Reports/admin tools
- [ ] Ratings, chat, notifications
- [ ] Advanced search/filtering

## Assumptions
- [ ] Supabase tables exist: `trips`, `join_requests`, `profiles`
- [ ] Contact info is stored in `profiles.email`, `profiles.phone`, and `profiles.instagram_handle`
- [ ] Visibility flags exist on `profiles`:
  `contact_email_visible`, `contact_phone_visible`, `contact_instagram_visible`
- [ ] Default visibility is email only
- [ ] Requests are gated by app logic (no DB unique constraint)

---

## Hour-by-hour execution plan (merged with Feb 14 plan)

### Hours 0–2: Environment + data verification
- [ ] Ensure local dev runs with Supabase env vars
- [ ] Validate trip list query returns data
- [ ] Confirm join_requests status values: `pending | accepted | declined | cancelled`
- [ ] Run one-time migration: `supabase_migrations_2026_02_15_add_contact_fields.sql`
- [ ] Confirm redirect URLs include `/auth/callback`

### Hours 2–6: Trips list + trip detail
- [ ] Build `app/(app)/trips/page.tsx`
- [ ] Show from/to, time, seats remaining, driver name
- [ ] Build `app/(app)/trips/[id]/page.tsx`
- [ ] Trip summary + seat remaining + driver info

### Hours 6–10: Passenger request flow
- [ ] Add server action: create join request
- [ ] Prevent duplicate request per user per trip (app check)
- [ ] Show status chip on trip detail

### Hours 10–14: Driver accept/decline
- [ ] List pending requests
- [ ] Accept/decline buttons
- [ ] Delete trip button (driver only)
- [ ] Accept increments `seats_taken` and sets request to `accepted`
- [ ] Decline sets request to `declined`
- [ ] Block accept if `seats_taken >= seats_total`

### Hours 14–18: Contact reveal
- [ ] Passenger sees driver + other accepted passengers’ contact info after acceptance
- [ ] Driver sees accepted passengers’ contact info after acceptance
- [ ] Contact info hidden if pending/declined
- [ ] Contact visibility toggles work (email default on)
- [ ] Join-request modal warns about contact sharing and supports “do not show again”

### Hours 18–22: QA + edge cases
- [ ] Manual test matrix (driver + passenger flow)
- [ ] Verify seat limits, duplicates, and status visibility
- [ ] Fix only critical bugs
- [ ] Verify RLS allows drivers/accepted passengers to view each other’s profiles

### Hours 22–24: Demo prep
- [ ] Write a 3-minute demo script
- [ ] Clean up UI copy / empty states
- [ ] Disable password login in prod

---

## Minimum user flows (must pass)

### Driver
1. Login
2. Post trip
3. View join requests
4. Accept/decline
5. See contact info after accept

### Passenger
1. Login
2. Browse trips
3. Request to join
4. See status
5. See contact info after accept

---

## Risk checklist
- [ ] Seats oversubscribed
- [ ] Duplicate join requests
- [ ] Contact info shown to non-accepted users
- [ ] Missing or empty trip list
- [ ] RLS blocks contact info for accepted members

If any of the above happen, stop and fix before polishing UI.

---

## Deployment checklist (when ready)
- [ ] Set env vars in hosting:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add Supabase redirect URL:
  `https://your-domain.com/auth/callback`
- [ ] Remove `NEXT_PUBLIC_ALLOW_PASSWORD_LOGIN=true`
- [ ] Run `npm run build` locally

## RLS checklist (profiles)
- [ ] drivers_can_read_accepted_passenger_profiles
- [ ] accepted_passengers_can_read_driver_profile
- [ ] accepted_members_can_read_each_other_profiles (optional)
