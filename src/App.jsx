// Main app imports - UI components and routing
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Set up React Query client for data fetching and caching
// This helps manage server state and provides nice loading/error states
const queryClient = new QueryClient();

const App = () => (
  // Wrap everything in providers to give child components access to:
  // - React Query for data management
  // - Tooltips for better UX
  // - Toast notifications for user feedback
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Two different toast systems - regular toasts and Sonner for variety */}
      <Toaster />
      <Sonner />
      
      {/* Router setup - pretty standard stuff */}
      <BrowserRouter>
        <Routes>
          {/* Main product management page */}
          <Route path="/" element={<Index />} />
          
          {/* Catch-all route for 404s - always put this last! */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;