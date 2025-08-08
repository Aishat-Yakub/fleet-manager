"use client";

import React, { useState } from "react";

interface VehiclePayload {
  plateNumber: string;
  registrationDate: string;
  model: string;
  color: string;
  condition: string;
  ownerId: number;
}

export default function VehicleForm() {
  const [formData, setFormData] = useState<VehiclePayload>({
    plateNumber: "",
    registrationDate: "",
    model: "",
    color: "",
    condition: "",
    ownerId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ownerId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic client validation
    if (!formData.plateNumber || !formData.model || !formData.ownerId) {
      setError("Plate number, model, and owner ID are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setSuccess(`Vehicle created with ID: ${data.id}`);
      setFormData({
        plateNumber: "",
        registrationDate: "",
        model: "",
        color: "",
        condition: "",
        ownerId: 0,
      });
    } catch (err) {
      setError("Failed to create vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Create New Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="plateNumber"
          placeholder="Plate Number"
          value={formData.plateNumber}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          type="date"
          name="registrationDate"
          value={formData.registrationDate}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          type="text"
          name="model"
          placeholder="Vehicle Model"
          value={formData.model}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          type="text"
          name="condition"
          placeholder="Condition (e.g. Good, Needs Repair)"
          value={formData.condition}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          type="number"
          name="ownerId"
          placeholder="Owner ID"
          value={formData.ownerId || ""}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Vehicle"}
        </button>
      </form>

      {success && <p className="mt-3 text-green-600">{success}</p>}
      {error && <p className="mt-3 text-red-600">{error}</p>}
    </div>
  );
}
