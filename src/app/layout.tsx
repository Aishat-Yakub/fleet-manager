import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: "LASU Fleet Manager",
  description: "LASU Fleet Manager- Manage all your car maintenance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        data-gptw=""
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
