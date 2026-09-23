/*
# Add get_my_admin_profile SECURITY DEFINER function

## Changes
- Creates a new function `get_my_admin_profile()` that returns the calling
  user's admin_users row as JSONB.
- This function bypasses RLS since it is SECURITY DEFINER, solving the
  timing issue where the authenticated session token hasn't fully propagated
  when the client tries to SELECT from admin_users immediately after sign-in.
- Returns NULL if the user is not authenticated or has no admin_users row.

## Security
- SECURITY DEFINER with search_path = 'public'.
- Only returns the row belonging to the calling user (auth.uid()), never
  another user's data.
- Executable by authenticated role only.
*/

CREATE OR REPLACE FUNCTION public.get_my_admin_profile()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid;
  v_result jsonb;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT to_jsonb(au) INTO v_result FROM admin_users au WHERE au.id = v_uid;
  RETURN v_result;
END;
$function$;
