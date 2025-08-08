"use client";

import { useEffect, useState } from "react";

interface AuditLog {
  logId: number;
  type: "fuel" | "maintenance" | "condition";
  requestId: number;
  changedBy: string;
  timestamp: string;
}

export default function AuditorLogsTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    from: "",
    to: "",
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);

      const res = await fetch(`/api/auditor/logs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch audit logs");

      const data = await res.json();
      setLogs(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Error loading logs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-[#111] text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Auditor Logs</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="fuel">Fuel</option>
          <option value="maintenance">Maintenance</option>
          <option value="condition">Condition</option>
        </select>

        <input
          type="date"
          value={filters.from}
          onChange={(e) => handleFilterChange("from", e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
        />

        <input
          type="date"
          value={filters.to}
          onChange={(e) => handleFilterChange("to", e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
        />

        <button
          onClick={fetchLogs}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="bg-red-600 text-white p-3 mb-4 rounded">{errorMsg}</div>
      )}

      {/* Table */}
      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Log ID</th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Type</th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Request ID</th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Changed By</th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log.logId}
                    className="hover:bg-gray-800 transition duration-200"
                  >
                    <td className="py-2 px-4 border-b border-gray-700">{log.logId}</td>
                    <td className="py-2 px-4 border-b border-gray-700 capitalize">
                      {log.type}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">{log.requestId}</td>
                    <td className="py-2 px-4 border-b border-gray-700 capitalize">
                      {log.changedBy}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 text-center text-gray-400 border-b border-gray-700"
                  >
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
