import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "FBS AI Knowledge Platform",
  description: "Search-first internal knowledge platform for IDX sales, support, compliance, and AI assistance."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
