import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";

// Lazy-load heavy pages — only download when navigated to
const NotesSelection = lazy(() => import("./pages/NotesSelection"));
const NotesList = lazy(() => import("./pages/NotesList"));
const Admin = lazy(() => import("./pages/Admin"));
const Projects = lazy(() => import("./pages/Projects"));
const Support = lazy(() => import("./pages/Support"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Terms = lazy(() => import("./pages/Terms"));
const Login = lazy(() => import("./pages/Login"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const MyPurchases = lazy(() => import("./pages/MyPurchases"));
const NoteViewer = lazy(() => import("./pages/NoteViewer"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Stable QueryClient — created once at module level
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — avoid refetching on every mount
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

/** Shows Admin dashboard if logged in as admin, otherwise Admin login form */
function AdminGate() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (user && role === "admin") {
    return <Admin />;
  }

  // Not logged in or not admin → show admin login form
  return <AdminLogin onSuccess={() => { /* auth state will update and re-render */ }} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/notes-selection" element={<NotesSelection />} />
                <Route path="/notes-list" element={<NotesList />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/support" element={<Support />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/my-purchases" element={<MyPurchases />} />
                <Route path="/view-notes" element={<NoteViewer />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminGate />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
