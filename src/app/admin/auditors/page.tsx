"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuditLog {
  id: number;
  user: {
    name: string;
  };
  action: string;
  createdAt: string;
}

const AuditorPage = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  return (
    <div className="container mx-auto p-4 text-sky-950">
      <Card>
        <CardHeader>
          <CardTitle className="text-sky-950">Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-sky-950">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-sky-950">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-sky-950">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{log.user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{log.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4">No audit logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditorPage;
