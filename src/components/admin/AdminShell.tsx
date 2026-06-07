import { ReactNode } from "react";
import { Bell } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { SharedFooter } from "@/components/SharedFooter";
import { useAuth } from "@/lib/auth";

export function AdminShell({ children }: { children: ReactNode }) {
  const user = useAuth();
  const initials = user
    ? user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--asari-off-white)]">
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 bg-[var(--asari-off-white)] border-b border-[var(--asari-gold)]/40 flex items-center justify-end px-4 gap-3">
            <button className="text-[var(--asari-charcoal)] hover:text-[var(--asari-gold)]" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-9 w-9 rounded-full bg-[var(--asari-gold)] text-white flex items-center justify-center text-sm font-medium">
              {initials}
            </div>
          </header>
          <main className="flex-1 p-6 md:p-8 overflow-x-hidden">{children}</main>
          <SharedFooter />
        </div>
      </div>
    </div>
  );
}
