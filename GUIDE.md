Here’s a **step-by-step setup guide for using hard-coded logins with your Supabase backend** and disabling default Auth:

---

## **1. Disable Supabase default login/sign-up**

1. Go to **Supabase Dashboard → Authentication → Settings**.
2. **Confirm email:** Turn **off** (not needed for hard-coded users).
3. **Allow new users to sign up:** Turn **off**.
4. **Enable email/password login:** Turn **off** (optional if you only want hard-coded login).
5. **Magic link / OAuth providers:** Turn **off** if you don’t need them.

✅ Result: Default Supabase Auth is fully disabled.

---

## **2. Keep hard-coded users in `users` table**

Example:

```sql
INSERT INTO public.users (name, email, username, role, status, password)
VALUES 
('Admin User', 'admin@lasu.com', 'admin', 'admin', 'active', 'admin'),
('Manager User', 'manager@lasu.com', 'manager', 'manager', 'active', 'manager'),
('Owner User', 'owner@lasu.com', 'owner', 'owner', 'active', 'owner'),
('Auditor User', 'auditor@lasu.com', 'auditor', 'auditor', 'active', 'auditor')
ON CONFLICT DO NOTHING;
```

---

## **3. Create a custom login function**

This replaces Supabase Auth for sign-in:

```sql
CREATE OR REPLACE FUNCTION public.login_user(
    p_username TEXT,
    p_password TEXT
)
RETURNS TABLE(
    id BIGINT,
    name TEXT,
    email TEXT,
    role TEXT,
    status TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT id, name, email, role, status
    FROM public.users
    WHERE username = p_username
      AND password = p_password
      AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

* Call this via **RPC endpoint**: `/rest/v1/rpc/login_user`
* Input: `{"p_username":"admin","p_password":"admin"}`

---

## **4. Frontend integration**

1. Replace all Supabase Auth calls with **POST to `login_user` RPC**.
2. Use the returned `role` to enforce **RLS policies** on the frontend.
3. Store the `id` and `role` in the frontend session to identify the user.

---

## **5. RLS policies remain active**

* Admin, Manager, Owner, Auditor tables already have RLS policies based on `role` and `owner_id`.
* No change needed — the hard-coded login works seamlessly with RLS.

---

✅ **Result:**

* Only your predefined users can log in.
* No one can sign up or bypass the hard-coded credentials.
* Frontend endpoints (GET/POST/PATCH/DELETE) work with roles.

---

If you want, I can **also provide the full ready-to-run SQL script** including:

* Users, vehicles, owner tables, sample data
* Hard-coded login function
* All RLS policies

This would let your frontend connect immediately.

Do you want me to do that?
