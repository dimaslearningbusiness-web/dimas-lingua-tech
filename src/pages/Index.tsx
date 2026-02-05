import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <header className="max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Dimas <span className="text-blue-600">Learning Business</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed">
          Master Technical English for the Global Tech Industry. 
          Expert training for developers, engineers, and tech leaders.
        </p>
      </header>
      
      <div className="flex flex-col sm:flex-row gap-6 mb-16">
        <Button 
          onClick={() => navigate("/admin")} 
          className="bg-blue-600 hover:bg-blue-700 text-xl px-10 py-8 h-auto shadow-lg"
        >
          Student Portal
        </Button>
        <Button 
          onClick={() => navigate("/admin")} 
          variant="outline"
          className="border-2 text-xl px-10 py-8 h-auto hover:bg-slate-50"
        >
          Administrator Access
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl">
        <div className="p-6 border-l-4 border-blue-600 bg-slate-50 rounded-r-lg">
          <h3 className="font-bold text-lg mb-2 text-slate-800">Technical Focus</h3>
          <p className="text-slate-600">Vocabulary and scenarios specific to IT and business growth.</p>
        </div>
        <div className="p-6 border-l-4 border-blue-600 bg-slate-50 rounded-r-lg">
          <h3 className="font-bold text-lg mb-2 text-slate-800">Global Scale</h3>
          <p className="text-slate-600">Prepare for international meetings and global job markets.</p>
        </div>
        <div className="p-6 border-l-4 border-blue-600 bg-slate-50 rounded-r-lg">
          <h3 className="font-bold text-lg mb-2 text-slate-800">Custom Path</h3>
          <p className="text-slate-600">Tailored learning experience for your specific career goals.</p>
        </div>
      </div>

      <footer className="mt-20 text-slate-400 text-sm">
        © 2026 Dimas Lingua Tech. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
