import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediaForge AI",
  description: "One source. Every format.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
