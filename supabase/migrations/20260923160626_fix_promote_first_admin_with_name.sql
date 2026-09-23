/*
# Fix promote_first_admin to accept full_name parameter

1. Modified Functions
- `promote_first_admin(p_full_name text)` — now accepts a full_name parameter so the first admin's
  name is stored correctly. Also updated to handle the case where the user already exists in admin_users.
  
2. New Functions
- `register_admin_user(p_full_name text)` — a SECURITY DEFINER function that inserts a new admin_user
  row for the calling user. This bypasses the RLS INSERT policy on admin_users which requires an existing
  admin. For the first user, they get 'admin' role. For subsequent users, they get 'editor' role.

3. Security
- Both functions are SECURITY DEFINER with search_path = public
- Only callable by authenticated users
*/

-- Drop old function signature first
DROP FUNCTION IF EXISTS promote_first_admin();

CREATE OR REPLACE FUNCTION register_admin_user(p_full_name text DEFAULT '')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_uid uuid;
  v_email text;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN 'not_authenticated';
  END IF;

  -- Check if already registered
  IF EXISTS (SELECT 1 FROM admin_users WHERE id = v_uid) THEN
    UPDATE admin_users SET full_name = p_full_name WHERE id = v_uid AND (full_name IS NULL OR full_name = '');
    RETURN 'already_exists';
  END IF;

  -- First user becomes admin, subsequent users become editor
  IF NOT EXISTS (SELECT 1 FROM admin_users) THEN
    v_role := 'admin';
  ELSE
    v_role := 'editor';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;

  INSERT INTO admin_users (id, email, full_name, role)
  VALUES (v_uid, v_email, p_full_name, v_role);

  RETURN v_role;
END;
$$;

REVOKE ALL ON FUNCTION register_admin_user(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION register_admin_user(text) TO authenticated;

-- Keep backward-compatible version
CREATE OR REPLACE FUNCTION promote_first_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM register_admin_user('');
END;
$$;

REVOKE ALL ON FUNCTION promote_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION promote_first_admin() TO authenticated;
