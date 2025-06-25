
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SupplierRegistration from "./pages/SupplierRegistration";
import SupplierList from "./pages/SupplierList";
import DemandRegistration from "./pages/DemandRegistration";
import DemandList from "./pages/DemandList";
import AIMatching from "./pages/AIMatching";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/supplier-registration" element={<SupplierRegistration />} />
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/demand-registration" element={<DemandRegistration />} />
          <Route path="/demands" element={<DemandList />} />
          <Route path="/ai-matching" element={<AIMatching />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
