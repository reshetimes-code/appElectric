// Thin wrapper shared by the whole /admin area (including /admin/login).
// The actual admin chrome (sidebar nav, logout button) lives in
// app/admin/(dashboard)/layout.tsx and is scoped to that route group only,
// so the login page renders as a plain centered card instead of showing nav
// links to pages the visitor can't use yet.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-sand-100">
      {children}
    </div>
  );
}
