import { ReactNode } from "react";
import { CustomerHeader } from "./CustomerHeader";
import { SharedFooter } from "./SharedFooter";

export function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--asari-off-white)]">
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <SharedFooter />
    </div>
  );
}
