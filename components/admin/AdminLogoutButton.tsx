"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/login", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-charcoal-300 transition-colors hover:bg-white/10 hover:text-white"
    >
      <LogOut size={17} />
      התנתקות
    </button>
  );
}
