"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { X, Plus, Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  category: string;
  vehicleType: string;
  securityLevel: string;
  arrivalTime: string;
  specialRequests: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([
    {
      id: uuidv4(),
      name: "John Doe",
      category: "VIP",
      vehicleType: "Bulletproof SUV",
      securityLevel: "High",
      arrivalTime: "7:15 PM",
      specialRequests: "Private entrance",
    },
    {
      id: uuidv4(),
      name: "Jane Smith",
      category: "Media",
      vehicleType: "Luxury Van",
      securityLevel: "Medium",
      arrivalTime: "7:30 PM",
      specialRequests: "Group drop-off",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: "",
    name: "",
    category: "",
    vehicleType: "",
    securityLevel: "",
    arrivalTime: "",
    specialRequests: "",
  });

  const handleAddUser = () => {
    if (!newUser.name.trim()) return;
    setUsers((prev) => [...prev, { ...newUser, id: uuidv4() }]);
    setNewUser({
      id: "",
      name: "",
      category: "",
      vehicleType: "",
      securityLevel: "",
      arrivalTime: "",
      specialRequests: "",
    });
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="p-6 bg-[#1e1e2f] text-white rounded-lg h-full shadow-lg max-w-full md:max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Guest List</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} /> Add Guest
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-[#27293d] text-gray-300">
            <tr>
              <th className="p-3 text-left">Guest Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Vehicle Type</th>
              <th className="p-3 text-left">Security Level</th>
              <th className="p-3 text-left">Arrival Time</th>
              <th className="p-3 text-left">Special Requests</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-700 hover:bg-[#33334d] transition"
              >
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.category}</td>
                <td className="p-3">{user.vehicleType}</td>
                <td className="p-3">{user.securityLevel}</td>
                <td className="p-3">{user.arrivalTime}</td>
                <td className="p-3">{user.specialRequests}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center text-gray-500 italic"
                >
                  No guests added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4">
          <div className="bg-[#27293d] p-6 rounded-lg w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Add New Guest</h3>
            <div className="grid grid-cols-1 gap-4">
              {["name", "category", "vehicleType", "securityLevel", "arrivalTime", "specialRequests"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (c) => c.toUpperCase())}
                  value={(newUser as any)[field]}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  className="bg-[#1e1e2f] border border-gray-600 p-2 rounded text-white placeholder-gray-400"
                />
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
