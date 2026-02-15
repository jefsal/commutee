# Email SMTP Plan (Resend + Vercel Domain)

## Goal
Replace Supabase default SMTP to avoid rate limits and enable reliable magic-link emails.

## Estimated Time
15–30 minutes (DNS verification is the longest step).

## Prerequisites
- A custom domain (you have one on Vercel)
- Access to DNS settings for that domain
- Resend account

---

## Step 1: Create Resend account
- Sign up at Resend
- Go to Domains and add your Vercel domain

## Step 2: Verify domain in Resend
- Resend will provide DNS records (SPF, DKIM, etc.)
- Add those records in your domain DNS (in Vercel or your registrar)
- Wait for verification (typically 5–15 minutes)

## Step 3: Create SMTP credentials in Resend
- In Resend, create SMTP credentials
- Copy the following values:
  - SMTP host
  - SMTP port
  - SMTP username
  - SMTP password

## Step 4: Configure Supabase SMTP
- In Supabase dashboard:
  - Auth → Settings → SMTP
- Fill in:
  - Host: (from Resend)
  - Port: (from Resend)
  - User: (from Resend)
  - Password: (from Resend)
  - Sender name: commutee
  - Sender email: something like no-reply@yourdomain.com

## Step 5: Test
- Request a magic link login in the app
- Confirm the email is delivered
- Verify the link works (redirects to /auth/callback and logs in)

---

## Notes
- Supabase default SMTP is rate limited; custom SMTP removes that bottleneck.
- If DNS verification is slow, double-check records in your DNS provider.
- Use a dedicated sender like `no-reply@yourdomain.com`.

