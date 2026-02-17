import { Outlet, Link, Navigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

export function Layout() {
  const { user, role, loading } = useAuth();

  // Admin should never see student pages — send them to admin dashboard
  if (!loading && user && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-muted/30">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 DiploMate. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
