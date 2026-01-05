import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotesSelection from "./pages/NotesSelection";
import NotesList from "./pages/NotesList";
import Admin from "./pages/Admin";
import Projects from "./pages/Projects";
import Departments from "./pages/Departments";
import Support from "./pages/Support";
import FAQs from "./pages/FAQs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/notes-selection" element={<NotesSelection />} />
            <Route path="/notes-list" element={<NotesList />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/support" element={<Support />} />
            <Route path="/faqs" element={<FAQs />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
