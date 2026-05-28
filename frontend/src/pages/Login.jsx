import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error("Invalid credentials. Please try again.");
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 absolute inset-0 z-50">
      <div className="max-w-md w-full elite-glass p-12 shadow-2xl relative overflow-hidden">
        
        {/* Subtle orange glow inside the glass */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-400/20 rounded-full blur-[40px] pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-6 shadow-xl flex items-center justify-center border-4 border-white/50 text-white">
            {/* Chef Hat or Logo Icon could go here */}
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome back</h2>
          <p className="text-slate-600 font-bold text-lg">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl font-bold text-center">
            {error}
          </div>
        )}
        
        <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-black text-slate-800 mb-2 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium text-lg shadow-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-slate-800 mb-2 uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium text-lg shadow-sm"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xl py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center mt-10"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        
        <p className="mt-10 text-center text-slate-600 font-bold relative z-10">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-600 hover:text-orange-700 transition hover:underline font-black">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
