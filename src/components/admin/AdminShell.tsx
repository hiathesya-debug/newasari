import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
<<<<<<< HEAD

export function AdminShell({ children }: { children: ReactNode }) {
=======
import { useAuth } from "@/lib/auth";

export function AdminShell({ children }: { children: ReactNode }) {
  const user = useAuth();

>>>>>>> d1c0379adb199bda33f20b84dd044026a97230ed
  return (
    <div className="min-h-screen flex flex-col bg-[var(--asari-off-white)]">
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
<<<<<<< HEAD
          {/* pt-20 on mobile to clear hamburger button, md:p-8 on desktop */}
          <main className="flex-1 p-6 pt-20 md:p-8 md:pt-8 overflow-x-hidden">
            {children}
          </main>
=======
          <main className="flex-1 p-6 md:p-8 overflow-x-hidden">{children}</main>
>>>>>>> d1c0379adb199bda33f20b84dd044026a97230ed
        </div>
      </div>
    </div>
  );
}