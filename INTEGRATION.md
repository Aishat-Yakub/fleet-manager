Perfect — here’s a **step-by-step guide to integrate your Supabase backend with hard-coded logins into your frontend**. I’ll assume you’re using JavaScript/TypeScript (React, Next.js, etc.), but the logic applies to any frontend framework.

---

## **1. Install Supabase Client**

```bash
npm install @supabase/supabase-js
```

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_PROJECT_REF.supabase.co';
const supabaseKey = 'YOUR_ANON_KEY';
export const supabase = createClient(supabaseUrl, supabaseKey);
```

* Replace `YOUR_PROJECT_REF` and `YOUR_ANON_KEY` from Supabase dashboard.
* Even though you’re not using default Auth, the client handles RPC calls and REST queries.

---

## **2. Login Function (Hard-coded users)**

```ts
export async function login(username: string, password: string) {
  const { data, error } = await supabase
    .rpc('login_user', { p_username: username, p_password: password });

  if (error) {
    console.error('Login error:', error.message);
    return null;
  }

  if (!data || data.length === 0) {
    alert('Invalid username or password');
    return null;
  }

  const user = data[0]; // The returned user object
  // Save user info in local storage or state
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}
```

* Calls the `login_user` SQL function you created.
* Returns user object with `id`, `role`, `email`, etc.

---

## **3. Role-based Access**

```ts
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (user.role === 'admin') {
  // Show admin dashboard
} else if (user.role === 'manager') {
  // Show manager dashboard
} else if (user.role === 'owner') {
  // Show owner dashboard
} else if (user.role === 'auditor') {
  // Show auditor dashboard
}
```

* Frontend can use the `role` to control UI and API access.

---

## **4. Calling Endpoints**

### **Admin Example: Get all users**

```ts
async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) console.error(error);
  return data;
}
```

### **Owner Example: Submit a condition update**

```ts
async function submitConditionUpdate(ownerId: number, vehicleId: number, condition: string, notes: string) {
  const { data, error } = await supabase
    .from('condition_updates')
    .insert([{ owner_id: ownerId, vehicle_id: vehicleId, condition, notes }]);

  if (error) console.error(error);
  return data;
}
```

* Supabase automatically enforces RLS based on the role.
* Owners can only insert/view their own rows; admins/managers can access what they’re allowed to.

---

## **5. File Upload (Owner Inspection Files)**

```ts
async function uploadInspectionFile(ownerId: number, vehicleId: number, file: File) {
  const { data, error } = await supabase
    .storage
    .from('inspection-files') // Your bucket name
    .upload(`${ownerId}/${file.name}`, file);

  if (error) console.error(error);
  return data?.path;
}
```

* Store the file URL/path in the `inspection_files` table.

---

## **6. Testing Plan**

| Role    | Test Action                                                                            |
| ------- | -------------------------------------------------------------------------------------- |
| Admin   | Create users, update user status, add vehicles, list users                             |
| Manager | Approve/reject fuel & maintenance requests, update vehicle status                      |
| Owner   | Submit condition updates, fuel requests, maintenance requests, upload inspection files |
| Auditor | View audit logs (if implemented)                                                       |

---

✅ **Result:**

* No Supabase Auth needed — hard-coded login works via `login_user` RPC.
* Role-based RLS enforces data access automatically.
* Frontend can call REST or use the Supabase client directly.

---

If you want, I can **write a full ready-to-use React frontend snippet** with **login, role-based dashboard, and sample CRUD calls** that plugs directly into your Supabase backend.

Do you want me to do that?
