import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Candidates from "@/pages/Candidates";
import AddCandidate from "@/pages/AddCandidate";
import { useState } from "react";

function Router() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <Switch>
      <Route path="/" component={() => <Dashboard sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />} />
      <Route path="/candidates" component={() => <Candidates sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />} />
      <Route path="/add" component={() => <AddCandidate sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
