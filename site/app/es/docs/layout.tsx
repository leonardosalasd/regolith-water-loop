import { Sidebar } from "@/components/Sidebar";
import { DocsShell } from "@/components/DocsShell";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar locale="es" />
      <DocsShell locale="es">{children}</DocsShell>
    </>
  );
}
