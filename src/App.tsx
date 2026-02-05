import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "@/components/ui/toaster";
import './index.css';

function App() {
  return (
    <BrowserRouter basename="/dimas-lingua-tech">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;

