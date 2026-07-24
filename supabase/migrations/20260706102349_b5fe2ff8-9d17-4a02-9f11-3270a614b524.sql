-- Grant admin to maheentouqeer786@gmail.com if the account exists.
-- If the user hasn't signed up yet, this is a no-op; sign up at /auth,
-- then this migration can be re-run or the insert done manually.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE lower(u.email) = 'maheentouqeer786@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;