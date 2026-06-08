import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/lib/auth";

export function AdminShell({ children }: { children: ReactNode }) {
  const user = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--asari-off-white)]">
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-6 md:p-8 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
}