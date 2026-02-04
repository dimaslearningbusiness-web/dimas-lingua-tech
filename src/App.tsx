import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "@/components/ui/toaster";
import './index.css'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Mostra a Landing Page quando o link for o principal */}
          <Route path="/" element={<Index />} />
          
          {/* Mostra o Admin apenas quando escreveres /admin no fim do link */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
