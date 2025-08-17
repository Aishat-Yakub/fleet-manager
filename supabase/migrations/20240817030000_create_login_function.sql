-- Drop old function if exists
DROP FUNCTION IF EXISTS public.login_user(text, text);

-- Create new safe login function
CREATE OR REPLACE FUNCTION public.login_user(
  p_username text,
  p_password text
) 
RETURNS TABLE (
  id int,
  name text,
  email text,
  username text,
  role text,
  status text,
  created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    u.id,
    u.name,
    u.email,
    u.username,
    u.role,
    u.status,
    u.created_at
  FROM users u
  WHERE u.username = p_username 
  AND u.password = p_password; 

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid username or password';
  END IF;
END;
$$;
