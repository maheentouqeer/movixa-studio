
-- 1. Lock down SECURITY DEFINER helpers: revoke from public/anon/authenticated,
--    keep service_role. RLS policies that call has_role run as the policy owner,
--    not the querying role, so revoking EXECUTE does not break them.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 2. Replace the always-true INSERT policy on contact_submissions with a
--    minimal validation check so empty/garbage submissions are rejected.
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.contact_submissions;

CREATE POLICY "Anyone can submit valid inquiry"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(full_name)) between 2 and 200
  AND length(btrim(email)) between 5 and 200
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(country)) between 2 and 100
  AND (project_description IS NULL OR length(project_description) <= 5000)
);
