"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchApi } from '@/lib/api';

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

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);

      const data = await fetchApi(`/auditor/logs?${params.toString()}`);
      setLogs(data as AuditLog[]);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Error loading logs");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="text-sky-950 p-6 rounded-lg border border-sky-950">
      <h2 className="text-xl font-semibold mb-4">Auditor Logs</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="bg-sky-700/10 border border-sky-950/20  text-sky-950 placeholder-sky-950 rounded px-3 py-2"
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
          className="bg-sky-700/10 border border-sky-950/20  text-sky-950 placeholder-sky-950 rounded px-3 py-2"
        />

        <input
          type="date"
          value={filters.to}
          onChange={(e) => handleFilterChange("to", e.target.value)}
          className="bg-sky-700/10 border border-sky-950/20  text-sky-950 placeholder-sky-950 rounded px-3 py-2"
        />

        <button
          onClick={fetchLogs}
          className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="text-red-600 p-3 mb-4 rounded">{errorMsg}</div>
      )}

      {/* Table */}
      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-sky-950 rounded-lg overflow-hidden">
            <thead className="bg-sky-200/20 border border-sky-950 text-sky-950">
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
