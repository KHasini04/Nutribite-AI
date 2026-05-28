import { useState, useEffect } from "react";
import { Send, Utensils, Sparkles, History, Wallet } from "lucide-react";
import { createRecommendation, addOrder } from "../api/dataApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Recommendations() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [dayPlan, setDayPlan] = useState(null);
  const [error, setError] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!prompt) return;
    
    setLoading(true);
    setError("");
    setRecommendations(null);
    setDayPlan(null);
    try {
      const data = await createRecommendation(prompt);
      const parsedRec = typeof data.recommendation === 'string' ? JSON.parse(data.recommendation) : data.recommendation;
      if (Array.isArray(parsedRec)) {
        setDayPlan(parsedRec);
      } else {
        setRecommendations(parsedRec);
      }
      toast.success("Found the perfect meal!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch recommendation.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanMyDay = async () => {
    setPrompt("Plan My Day");
    setLoading(true);
    setError("");
    setRecommendations(null);
    setDayPlan(null);
    try {
      const data = await createRecommendation("Plan My Day");
      const parsedRec = typeof data.recommendation === 'string' ? JSON.parse(data.recommendation) : data.recommendation;
      if (Array.isArray(parsedRec)) setDayPlan(parsedRec);
      toast.success("Day plan generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch day plan.");
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async () => {
    if (!checkoutItem) return;
    setOrdering(true);
    try {
      await addOrder({
        restaurant: "Swiggy",
        meal_name: checkoutItem.meal_name,
        amount: checkoutItem.calories > 300 ? 150 : 90, 
        calories: checkoutItem.calories || 0,
        protein: checkoutItem.protein || 0,
        carbs: checkoutItem.carbs || 0,
        fat: checkoutItem.fat || 0,
        date: new Date().toISOString()
      });
      toast.success("Payment successful! Order placed.");
      setCheckoutItem(null);
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to process payment");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="elite-glass p-10 shadow-lg border-white/80 rounded-[2rem]">
        <h2 className="text-4xl font-black tracking-tight mb-3 flex items-center gap-3 text-slate-900">
          <Sparkles className="text-orange-500 w-8 h-8" /> AI Food Companion
        </h2>
        <p className="text-slate-700 mb-8 max-w-2xl font-medium text-lg leading-relaxed">
          Tell me what you're craving, your budget, or your nutritional goals, and I'll find the perfect meal for you from nearby restaurants.
        </p>
        
        <form onSubmit={handleAskAI} className="relative max-w-3xl">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Suggest a high protein dinner under ₹180..."
            className="w-full pl-6 pr-16 py-5 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm text-lg transition-all font-medium placeholder-slate-400"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 flex items-center justify-center transition-all disabled:opacity-70 shadow-md"
          >
            {loading && prompt !== "Plan My Day" ? "Thinking..." : <Send size={22} />}
          </button>
        </form>
        
        <div className="mt-6 flex items-center gap-4">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Or</p>
          <button 
            onClick={handlePlanMyDay}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 py-3 font-black shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <Sparkles size={18} /> {loading && prompt === "Plan My Day" ? "Planning..." : "Plan My Day"}
          </button>
        </div>
        
        {error && <p className="text-rose-600 mt-4 text-sm font-bold bg-rose-50 inline-block px-4 py-2 rounded-lg">{error}</p>}
      </div>

      {recommendations && (
        <div className="elite-glass rounded-[2rem] p-10 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <Utensils className="text-orange-500 w-7 h-7" /> Top Suggestion
          </h3>
          
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <h4 className="text-4xl font-black text-slate-900 leading-tight">{recommendations.meal_name}</h4>
              <p className="text-slate-700 mt-4 text-lg font-medium leading-relaxed">{recommendations.reason}</p>
              
              <button 
                onClick={() => setCheckoutItem(recommendations)}
                className="mt-8 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all w-full shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Order via Swiggy
              </button>
            </div>
            
            <div className="flex-1">
              <h5 className="font-bold text-slate-900 mb-5 text-xl">Nutritional Breakdown</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 p-5 rounded-2xl border border-white/50 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500 font-bold mb-1">Calories</p>
                  <p className="text-3xl font-black text-slate-900">{recommendations.calories} <span className="text-base font-bold text-slate-500">kcal</span></p>
                </div>
                <div className="bg-white/80 p-5 rounded-2xl border border-white/50 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500 font-bold mb-1">Protein</p>
                  <p className="text-3xl font-black text-slate-900">{recommendations.protein}<span className="text-base font-bold text-slate-500">g</span></p>
                </div>
                <div className="bg-white/80 p-5 rounded-2xl border border-white/50 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500 font-bold mb-1">Carbs</p>
                  <p className="text-3xl font-black text-slate-900">{recommendations.carbs}<span className="text-base font-bold text-slate-500">g</span></p>
                </div>
                <div className="bg-white/80 p-5 rounded-2xl border border-white/50 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500 font-bold mb-1">Fat</p>
                  <p className="text-3xl font-black text-slate-900">{recommendations.fat}<span className="text-base font-bold text-slate-500">g</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {dayPlan && (
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Utensils className="text-orange-500 w-7 h-7" /> Your Full Day Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dayPlan.map((meal, index) => (
              <div key={index} className="elite-glass rounded-3xl p-6 shadow-lg flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wide mb-2">{meal.reason}</h4>
                  <h5 className="text-2xl font-black text-slate-900 leading-tight mb-4">{meal.meal_name}</h5>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">{meal.calories} kcal</span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">{meal.protein}g Protein</span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">{meal.carbs}g Carbs</span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">{meal.fat}g Fat</span>
                  </div>
                </div>
                <button 
                  onClick={() => setCheckoutItem(meal)}
                  className="bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-black w-full shadow-md transition-all flex justify-center items-center gap-2"
                >
                  Order via Swiggy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stripe Checkout Mock Modal */}
      {checkoutItem && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><Wallet className="text-emerald-500" /> Secure Checkout</h3>
              <button onClick={() => setCheckoutItem(null)} className="text-slate-400 hover:text-slate-600 font-bold">Close</button>
            </div>
            <div className="p-8">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-500 mb-1">Items</p>
                <h4 className="text-2xl font-black text-slate-900">{checkoutItem.meal_name}</h4>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-900">₹{checkoutItem.calories > 300 ? 150 : 90}</span>
                </div>
              </div>
              <button 
                onClick={confirmOrder}
                disabled={ordering}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-black text-xl py-4 rounded-2xl shadow-lg transition-all flex justify-center items-center gap-2"
              >
                {ordering ? "Processing..." : `Pay ₹${checkoutItem.calories > 300 ? 150 : 90}`}
              </button>
              <p className="text-center text-xs text-slate-400 font-medium mt-4">Powered by mock Stripe integration</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
