import React from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen font-sans antialiased">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {children}
      </div>
    </div>
  );
}
