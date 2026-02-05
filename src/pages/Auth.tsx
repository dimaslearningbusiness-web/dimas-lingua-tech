import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true);
    const { error } = type === "login" 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else {
      alert(type === "login" ? "Welcome back!" : "Account created!");
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Access Portal</h2>
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          onClick={() => handleAuth("login")}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 mb-3 transition"
        >
          {loading ? "Loading..." : "Login"}
        </button>
        <button 
          onClick={() => handleAuth("signup")}
          disabled={loading}
          className="w-full bg-gray-200 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Auth;
