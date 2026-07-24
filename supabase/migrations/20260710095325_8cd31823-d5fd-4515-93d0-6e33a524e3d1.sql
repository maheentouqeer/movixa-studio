INSERT INTO public.user_roles (user_id, role)
VALUES ('f5269ab7-82cd-4ff8-a2cb-4d15dad53389', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;