-- Create one family and print its two links.
-- Edit the three values, then run this in the Supabase SQL Editor.
-- Copy the two tokens it returns - this is the only convenient time to get them.

insert into public.families (parent_label, child_label, timezone)
values ('Mom', 'Sarah', 'America/Chicago')
returning
  parent_label,
  '/parent/'    || parent_token as parent_link,
  '/dashboard/' || child_token  as dashboard_link;
