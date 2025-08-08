import React from 'react';

export default function NotificationSidebar() {
  return (
    <div className="w-80 bg-white border-l border-gray-200 shadow-lg p-4 overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <div className="space-y-3">
        <div className="p-3 bg-blue-50 rounded">
          <p className="text-blue-700">New user registered</p>
          <p className="text-xs text-gray-500">2 minutes ago</p>
        </div>
        <div className="p-3 bg-green-50 rounded">
          <p className="text-green-700">Vehicle added to fleet</p>
          <p className="text-xs text-gray-500">10 minutes ago</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded">
          <p className="text-yellow-700">Pending request received</p>
          <p className="text-xs text-gray-500">30 minutes ago</p>
        </div>
      </div>
    </div>
  );
}
