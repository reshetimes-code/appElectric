"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { showError } from "@/lib/alert";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSpinner = useDelayedPending(loading, 500);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "שגיאה בהתחברות");
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[var(--radius-card)] border border-sand-300 bg-white p-8">
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-900 text-white">
            <Lock size={20} />
          </div>
          <h1 className="font-heading text-xl font-semibold text-charcoal-900">כניסת מנהל</h1>
          <p className="text-sm text-charcoal-500">אזור זה מוגן — יש להזין סיסמת מנהל.</p>
        </div>
        <label className="mb-1.5 block text-sm text-charcoal-600">סיסמה</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="mb-3 h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
        />
        <Button type="submit" size="lg" fullWidth disabled={loading} className="mt-3">
          {showSpinner && <Spinner size={16} />}
          {loading ? "מתחבר..." : "כניסה"}
        </Button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
