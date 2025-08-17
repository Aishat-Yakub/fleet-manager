'use client';

import { AuditTrail } from '../components/audit-trail';

export default function AuditorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Auditor Dashboard</h1>
      <div>
        <AuditTrail />
      </div>
    </div>
  );
}
