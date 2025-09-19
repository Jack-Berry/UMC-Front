import { Outlet, Link, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { to: "/admin", label: "Assessments" },
    { to: "/admin/news", label: "News" },
    { to: "/admin/events", label: "Events" },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-800 border-r border-neutral-700 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Portal</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`p-2 rounded transition ${
                  active
                    ? "bg-brand-600 text-white"
                    : "hover:bg-neutral-700 text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
