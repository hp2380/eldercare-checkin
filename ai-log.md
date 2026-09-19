\# AI Development Log



How I used Claude Code on this project, including where its output needed correcting. Each entry covers what happened, what I did, and what I took from it.



\## Server components vs. API routes

\*\*What happened:\*\* My spec said all database access goes through API routes. Claude Code flagged that reading data directly in server components gives the same security with less code, and asked before deviating.

\*\*What I did:\*\* Approved it for reads and kept an API route for writes, since the browser needs to call that one.

\*\*Takeaway:\*\* The rule's intent (never touch the database from the browser) mattered more than its literal wording.



\## Secret key leak caught at build time

\*\*What happened:\*\* I asked for a `server-only` guard on files holding the Supabase secret key. On the first build it failed: a browser component was importing a type from a file that loads the key. Without the guard, the build would have succeeded and shipped database credentials to every visitor.

\*\*What I did:\*\* Kept the guard. Shared types moved into a separate browser-safe file.

\*\*Takeaway:\*\* Cheap guardrails that fail loudly beat trusting generated code to get boundaries right.



\## Timezones and daylight saving

\*\*What happened:\*\* The server runs in UTC, but a parent in India or Texas lives in a different "today." I asked how the app decides which day a check-in belongs to. Claude Code added a timezone per family, and its own tests caught a bug in its first draft where stepping back 24 hours duplicated a day across a DST change.

\*\*What I did:\*\* Raised the question and set the test family's timezone explicitly.

\*\*Takeaway:\*\* "Did Mom check in today" depends on whose today. This bug would have looked fine in local testing.



\## Scaffolding tool refused to run

\*\*What happened:\*\* `create-next-app` refused to run in a folder that already contained `CLAUDE.md`.

\*\*What I did:\*\* Let Claude Code write the Next.js config by hand instead.

\*\*Takeaway:\*\* Fewer generated files, less boilerplate to explain.



\## Database permission denied

\*\*What happened:\*\* The generated schema created tables but didn't grant access. My Supabase project blocks new tables from the public API by default, so even the server key got "permission denied for table families."

\*\*What I did:\*\* Read the error, granted access only to the server's service role, and had the grants added to `schema.sql` so a fresh setup works.

\*\*Takeaway:\*\* Generated code assumed default settings. My locked-down configuration needed explicit permissions.

