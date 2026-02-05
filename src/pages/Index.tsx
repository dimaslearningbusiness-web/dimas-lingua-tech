import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Dimas <span className="text-blue-600">Learning Business</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl">
        High-level Technical English for IT Professionals and Global Leaders.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => navigate("/auth")}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-700 shadow-md transition"
        >
          Student Portal
        </button>
        <button 
          onClick={() => navigate("/auth")}
          className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-50 transition"
        >
          Admin Access
        </button>
      </div>
    </div>
  );
};

export default Index;
