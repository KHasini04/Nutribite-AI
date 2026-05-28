import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Home, Search, Receipt, User, Users } from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <header className="clean-header sticky top-0 z-50 px-8 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 shadow-md"></div>
          NutriBite
        </h1>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={`font-bold transition ${location.pathname === '/' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-500'}`}>Dashboard</Link>
          <Link to="/recommendations" className={`font-bold transition ${location.pathname === '/recommendations' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-500'}`}>Recommendations</Link>
          <Link to="/orders" className={`font-bold transition ${location.pathname === '/orders' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-500'}`}>Orders</Link>
          <Link to="/nutrition" className={`font-bold transition ${location.pathname === '/nutrition' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-500'}`}>Nutrition</Link>
          <Link to="/community" className={`font-bold transition ${location.pathname === '/community' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-500'}`}>Community</Link>
          <Link to="/profile" className={`font-bold transition ${location.pathname === '/profile' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-500'}`}>Profile</Link>
          
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-slate-600 hover:text-rose-600 font-bold transition-all px-4 py-2 rounded-full hover:bg-rose-50 flex items-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <Link to="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all">Log in</Link>
          )}
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8 relative z-10">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 flex justify-around items-center p-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}>
            <Home size={22} />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link to="/recommendations" className={`flex flex-col items-center gap-1 ${location.pathname === '/recommendations' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}>
            <Search size={22} />
            <span className="text-[10px] font-bold">AI Plan</span>
          </Link>
          <Link to="/orders" className={`flex flex-col items-center gap-1 ${location.pathname === '/orders' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}>
            <Receipt size={22} />
            <span className="text-[10px] font-bold">Orders</span>
          </Link>
          <Link to="/community" className={`flex flex-col items-center gap-1 ${location.pathname === '/community' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}>
            <Users size={22} />
            <span className="text-[10px] font-bold">Community</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}>
            <User size={22} />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </nav>
      )}
    </div>
  );
}
