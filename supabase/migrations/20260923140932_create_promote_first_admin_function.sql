/*
# Auto-promote first admin user

Creates a database function that allows the first registered user to become an admin.
This is needed because admin_users INSERT policy requires an existing admin,
creating a chicken-and-egg problem for the very first user.

The function checks if there are zero admin_users rows, and if so, inserts the
calling user as an admin. Otherwise it does nothing.

1. New Functions
- `promote_first_admin()` — callable by authenticated users, promotes caller to admin if no admins exist yet

2. Security
- SECURITY DEFINER so it can bypass the admin_users INSERT policy
- Only works when the table is empty (first user scenario)
*/

CREATE OR REPLACE FUNCTION promote_first_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users) THEN
    INSERT INTO admin_users (id, email, full_name, role)
    VALUES (
      auth.uid(),
      (SELECT email FROM auth.users WHERE id = auth.uid()),
      '',
      'admin'
    );
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION promote_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION promote_first_admin() TO authenticated;
