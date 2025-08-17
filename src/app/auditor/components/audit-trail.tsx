'use client';

import { useState, useEffect } from 'react';
import { auditorService, type AuditLog } from '../../../services/auditorService';
import { Loader2 } from 'lucide-react';

export function AuditTrail() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await auditorService.getAuditTrail();
        setLogs(data);
      } catch (err) {
        console.error('Error fetching audit trail:', err);
        setError('Failed to load audit trail.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
        <span className="ml-2 text-sky-600">Loading audit trail...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">System Audit Trail</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">Timestamp</th>
              <th scope="col" className="px-6 py-3">User</th>
              <th scope="col" className="px-6 py-3">Action</th>
              <th scope="col" className="px-6 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">No audit logs found.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{log.profiles?.full_name || 'System'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">{log.action}</span></td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-700">{JSON.stringify(log.details)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
