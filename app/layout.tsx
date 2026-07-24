import type { Metadata } from "next";
import "./styles.css";
import "./enhancements.css";
import "./redesign.css";
import "./customize.css";

export const metadata: Metadata = {
  title: "BAS AI Knowledge Platform",
  description: "FBS internal AI knowledge platform for IDX sales, support, compliance, and product guidance."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}