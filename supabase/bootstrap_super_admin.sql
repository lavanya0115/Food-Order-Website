-- Run only in the Supabase SQL Editor after the account has registered. Replace the email intentionally.
update public.user_roles set role='super_admin',assigned_by=user_id,assigned_at=now() where user_id=(select id from auth.users where email='replace-with-owner-email@example.com');
