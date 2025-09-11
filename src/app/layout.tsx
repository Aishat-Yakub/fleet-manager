import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";

export const metadata: Metadata = {
  title: "LASU Fleet Manager",
  description: "LASU Fleet Manager- Manage all your car maintenance",
  icons:{
    icon: "/favicon.ico",
    shortcut: "/logo.png"
    
  }
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
          {children}
      </body>
    </html>
  );
}
