import { useState, useEffect } from "react";
import { Search, Info, Activity } from "lucide-react";
import { getNutrition } from "../api/dataApi";
import { useNavigate } from "react-router-dom";

export default function Nutrition() {
  const [food, setFood] = useState("");
  const [loading, setLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!food.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const data = await getNutrition(food);
      setNutrition(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch nutrition data. The item might not be found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="elite-glass p-10 shadow-lg border-white/80 rounded-[2rem]">
        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Nutrition Analysis</h2>
        <p className="text-slate-700 font-medium text-lg max-w-2xl">Search for any food item to see its detailed nutritional profile.</p>

        <form onSubmit={handleSearch} className="relative max-w-2xl mt-8">
          <input 
            type="text" 
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="e.g. 1 cup of brown rice, 2 boiled eggs..."
            className="w-full pl-6 pr-16 py-5 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm text-lg transition-all font-medium placeholder-slate-400"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 flex items-center justify-center transition-all disabled:opacity-70 shadow-md"
          >
            {loading ? "Searching..." : <Search size={22} />}
          </button>
        </form>
        {error && <p className="text-rose-600 mt-4 text-sm font-bold bg-rose-50 inline-block px-4 py-2 rounded-lg flex items-center gap-2"><Info size={16}/> {error}</p>}
      </div>

      {nutrition && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="elite-glass rounded-[2rem] p-10 shadow-lg border-white/80">
            <h3 className="text-3xl font-black text-slate-900 capitalize mb-8">{nutrition.meal_name}</h3>
            
            <div className="bg-orange-50/80 p-6 rounded-2xl border border-orange-200/50 mb-6 flex flex-col items-center justify-center shadow-sm">
              <p className="text-sm text-orange-800 font-black uppercase tracking-wider mb-2">Calories</p>
              <p className="text-5xl font-black text-orange-600 tracking-tight">{nutrition.calories}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/80 p-5 rounded-2xl border border-white/50 shadow-sm flex justify-between items-center backdrop-blur-sm">
                <span className="font-bold text-slate-600">Protein</span>
                <span className="font-black text-slate-900 text-xl">{nutrition.protein}g</span>
              </div>
              <div className="bg-white/80 p-5 rounded-2xl border border-white/50 shadow-sm flex justify-between items-center backdrop-blur-sm">
                <span className="font-bold text-slate-600">Total Carbohydrates</span>
                <span className="font-black text-slate-900 text-xl">{nutrition.carbs}g</span>
              </div>
              <div className="bg-white/80 p-5 rounded-2xl border border-white/50 shadow-sm flex justify-between items-center backdrop-blur-sm">
                <span className="font-bold text-slate-600">Total Fat</span>
                <span className="font-black text-slate-900 text-xl">{nutrition.fat}g</span>
              </div>
            </div>
          </div>
          
          <div className="elite-glass rounded-[2rem] p-10 shadow-lg border-white/80 flex flex-col justify-center items-center text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <Activity size={48} className="text-orange-500" />
            </div>
            <h4 className="text-3xl font-black text-slate-900 mb-4">Track Your Macros</h4>
            <p className="text-slate-700 font-medium text-lg max-w-sm mb-10 leading-relaxed">
              Understanding what's in your food is the first step to achieving your dietary goals. Need meal suggestions based on these macros?
            </p>
            <button 
              onClick={() => navigate('/recommendations')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl w-full max-w-sm"
            >
              Ask AI for Alternatives
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
