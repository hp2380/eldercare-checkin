-- Create one family and print its two links.
-- Edit the three values, then run this in the Supabase SQL Editor.
-- Copy the two tokens it returns - this is the only convenient time to get them.

-- The timezone is the PARENT's, and it decides what "today" means for this
-- family. The child is often somewhere else entirely, which is the whole
-- point of the app, so their location is never stored or needed.
--
-- Common values: 'America/Chicago', 'America/New_York', 'Europe/Paris',
--                'Asia/Kolkata', 'Australia/Sydney'
--
-- The demo below is a parent in the United States with a child in France.

insert into public.families (parent_label, child_label, timezone)
values ('Demo Parent (Chicago)', 'Demo Child (Paris)', 'America/Chicago')
returning
  parent_label,
  '/parent/'    || parent_token as parent_link,
  '/dashboard/' || child_token  as dashboard_link;
