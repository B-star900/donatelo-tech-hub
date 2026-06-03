import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Package, Tags, ShoppingBag, LogOut, ShieldOff } from "lucide-react";
import { signOut, useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — DONATELO" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center text-muted-foreground">Cargando...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
        <div>
          <ShieldOff className="mx-auto h-10 w-10 text-brand" />
          <h1 className="mt-4 font-display text-2xl font-bold">Acceso restringido</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu cuenta no tiene permisos de administrador.
          </p>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/auth" });
            }}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </div>
    );
  }

  const items = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/productos", label: "Productos", icon: Package },
    { to: "/admin/categorias", label: "Categorías", icon: Tags },
    { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr] md:px-6">
      <aside className="h-fit rounded-2xl border border-border bg-card p-4">
        <p className="px-2 pb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Admin
        </p>
        <nav className="space-y-1">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: i.exact }}
            >
              <i.icon className="h-4 w-4" /> {i.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={async () => {
            await signOut();
            navigate({ to: "/" });
          }}
          className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
      </aside>

      <section>
        <Outlet />
      </section>
    </div>
  );
}
