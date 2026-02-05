import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth"; // Importa a nova página
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Toaster />
    </HashRouter>
  );
}

export default App;
