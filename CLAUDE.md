# ElderCare Check-in



## What this is

A two-sided web app for adult children who live far from an aging parent.

- Parent page: big simple buttons ("I'm okay today", "Took my morning meds"). Must be usable by a 75 year old on a phone.

- Child dashboard: shows whether the parent checked in today, the recent history, and a clear flag if today's check-in is missing.



## Stack

Next.js (App Router, TypeScript), Supabase (Postgres), deployed on Vercel.



## Scope rules

- No login system in v1. Each family gets two unique link tokens: one for the parent page, one for the child dashboard.

- All database access goes through server-side Next.js API routes using the Supabase secret (service role) key. Never query Supabase from the browser. RLS is on and tables are not exposed to the public API.

- Do NOT build appointments, mood tracking, charts, or settings yet.

- Keep it simple enough that I can explain every file.



## How to work with me

- I'm learning web dev. Explain what you're doing and why before big changes.

- Secrets go in .env.local and never get committed.

- Make small commits with clear messages.

