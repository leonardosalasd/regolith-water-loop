import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DocsShell } from "@/components/DocsShell";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar locale="en" />
      <DocsShell locale="en">{children}</DocsShell>
    </>
  );
}
