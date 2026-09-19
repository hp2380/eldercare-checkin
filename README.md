# ElderCare Check-in

A daily check-in app for adult children caring for an aging parent from a distance.

## Live demo

Both links below belong to the same demo family, so you can see both sides.

**Parent page:** https://eldercare-checkin.vercel.app/parent/40f55fc6718217773cd7bdc11022419b

**Child dashboard:** https://eldercare-checkin.vercel.app/dashboard/b87d69e589735652394eb456374e097b

Try tapping a button on the parent page, then open the dashboard to watch it appear.

## The problem

Adult children who live far from an aging parent have no low-effort way to know the parent is okay each day. The realistic alternatives are a daily phone call, which is hard to sustain across time zones and work schedules, or nothing at all.

This is growing in India, where more families are nuclear and the senior population keeps rising.

## How it works

**Parent page.** Two large buttons: "I'm okay today" and "Took my morning meds". Nothing else on the screen. Built to be usable by a 75 year old on a phone.

**Child dashboard.** Leads with the one fact that matters, whether today's check-in has happened, in green or red. Below that sits 14 days of history with missing days called out. It refreshes itself every minute.

**No logins.** Each family gets two unique link tokens, one per page. The parent opens a bookmarked link and taps a button. No account, no password, no app to install. This was the biggest usability decision in v1: a password is exactly the kind of friction that stops an elderly user from ever adopting the product.

## Key decisions

**The database is never reachable from the browser.** All data access runs server-side with a secret key that never ships to the client. Row-level security is on and the browser-facing database roles have no access at all. A build-time guard fails the build if a browser component ever imports the database client, which caught a real leak during development.

**Timezones are per family.** "Did Mom check in today?" depends on whose today. A tap at 8pm in Chicago is 1am the next day in UTC, so using the server's date would show a false missed check-in every morning. Each family stores its own timezone and every date is computed in it.

**v1 is deliberately small.** No appointments, no mood tracking, no charts, no settings. The question worth answering first is whether families will use a daily check-in at all. Everything beyond that is a guess until this one is settled.

## Stack

Next.js (App Router, TypeScript), Supabase (Postgres), deployed on Vercel.

Built with Claude Code. [ai-log.md](ai-log.md) records how it was used, including where its output needed correcting.

## Status

v1 is live. User conversations and a small pilot with real families are in progress. No results to report yet.

## Local setup

1. `npm install`
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and fill in your Supabase project URL and secret key.
4. Run `supabase/create-family.sql` to create a family. It returns the two link paths.
5. `npm run dev`, then open one of those paths.
