/*
# Update register_admin_user to return full admin user data as JSONB

## Changes
- Drops and recreates register_admin_user function with JSONB return type
  (previously returned text).
- Now returns the complete admin_users row as a JSON object, allowing the
  sign-up flow to use the data directly without a separate SELECT query.
- On error (not authenticated), returns {"error": "not_authenticated"}.
- This fixes a timing issue where the SELECT after sign-up could fail due
  to RLS token propagation delays.

## Security
- Still SECURITY DEFINER with search_path = 'public'.
- Same logic: first user gets 'admin' role, subsequent users get 'editor'.
*/

DROP FUNCTION IF EXISTS public.register_admin_user(text);

CREATE FUNCTION public.register_admin_user(p_full_name text DEFAULT ''::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_role text;
  v_uid uuid;
  v_email text;
  v_result jsonb;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('error', 'not_authenticated');
  END IF;

  -- Check if already registered
  IF EXISTS (SELECT 1 FROM admin_users WHERE id = v_uid) THEN
    UPDATE admin_users SET full_name = p_full_name WHERE id = v_uid AND (full_name IS NULL OR full_name = '');
    SELECT to_jsonb(au) INTO v_result FROM admin_users au WHERE au.id = v_uid;
    RETURN v_result;
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

  SELECT to_jsonb(au) INTO v_result FROM admin_users au WHERE au.id = v_uid;
  RETURN v_result;
END;
$function$;
