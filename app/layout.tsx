import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "BAS AI Knowledge Platform",
  description: "FBS internal AI knowledge platform for IDX sales, support, compliance, and product guidance."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
