"use client";

import React, { useState } from "react";
import { fetchApi } from '@/lib/api';

interface CreateUserPayload {
  name: string;
  email: string;
  role: string;
  phone?: string;
  password: string;
}

export default function CreateUserForm() {
  const [formData, setFormData] = useState<CreateUserPayload>({
    name: "",
    email: "",
    role: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: keyof CreateUserPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await fetchApi('/admin/users', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSuccessMsg('User created successfully');
      setFormData({
        name: '',
        email: '',
        role: '',
        phone: '',
        password: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-sky-950 border border-sky-950 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-6">Create New User</h2>

      {successMsg && (
        <div className="bg-green-600 text-white p-3 mb-4 rounded">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="bg-red-600 text-white p-3 mb-4 rounded">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          className="bg-sky-100/50 border border-sky-700/40 p-2 rounded text-sky-950 placeholder-sky-950"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          className="bg-sky-100/50 border border-sky-700/40 p-2 rounded text-sky-950 placeholder-sky-950"
        />
        <select
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
            required
            className="bg-sky-100/50 border border-sky-700/40 p-2 rounded text-sky-950 placeholder-sky-950"
          >
          <option value="">Select Role</option>
          <option value="driver">Driver</option>
          <option value="manager">Manager</option>
          <option value="auditor">Auditor</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="bg-sky-100/50 border border-sky-700/40 p-2 rounded text-sky-950 placeholder-sky-950"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
          className="bg-sky-100/50 border border-sky-700/40 p-2 rounded text-sky-950 placeholder-sky-950"
        />

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg text-white transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
