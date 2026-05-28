import { useState, useEffect } from "react";
import { updateProfile, clearOrders } from "../api/dataApi";
import { User, Settings, Trash2, Activity } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    monthly_budget: "",
    goal: "Weight Loss",
    food_preference: "Any",
    target_calories: 2000,
    target_protein: 100
  });
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        monthly_budget: parsedUser.monthly_budget || "",
        goal: parsedUser.goal || "Weight Loss",
        food_preference: parsedUser.food_preference || "Any",
        target_calories: parsedUser.target_calories || 2000,
        target_protein: parsedUser.target_protein || 100
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        monthly_budget: formData.monthly_budget ? Number(formData.monthly_budget) : null,
        goal: formData.goal,
        food_preference: formData.food_preference,
        target_calories: Number(formData.target_calories),
        target_protein: Number(formData.target_protein)
      };
      
      const response = await updateProfile(payload);
      // Update local storage
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearOrders = async () => {
    if (!window.confirm("Are you sure you want to clear all your order history? This cannot be undone.")) return;
    
    setClearing(true);
    try {
      await clearOrders();
      toast.success("Order history cleared!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear order history.");
    } finally {
      setClearing(false);
    }
  };

  if (!user) return <div className="p-8 text-slate-800 font-bold">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="elite-glass p-10 rounded-[2rem] shadow-xl border-white/80 bg-white/95">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-inner">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your Profile</h2>
            <p className="text-slate-600 font-bold mt-1 text-lg">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Settings size={14} className="text-orange-500" /> Monthly Budget (₹)
              </label>
              <input 
                type="number" 
                name="monthly_budget"
                required 
                min={500}
                value={formData.monthly_budget}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-bold text-xl shadow-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-black text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Settings size={14} className="text-orange-500" /> Dietary Preference
              </label>
              <select 
                name="food_preference"
                value={formData.food_preference}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 font-bold text-lg shadow-sm"
              >
                <option value="Any">Any</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Settings size={14} className="text-orange-500" /> Primary Goal
            </label>
            <select 
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 font-bold text-lg shadow-sm"
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintenance">Maintenance</option>
              <option value="General Health">General Health</option>
              <option value="High Protein">High Protein</option>
              <option value="Low Carb">Low Carb</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Settings size={14} className="text-orange-500" /> Daily Calorie Target
              </label>
              <input 
                type="number" 
                name="target_calories"
                required 
                min={500}
                value={formData.target_calories}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 font-bold text-lg shadow-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-black text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Settings size={14} className="text-orange-500" /> Daily Protein Target (g)
              </label>
              <input 
                type="number" 
                name="target_protein"
                required 
                min={10}
                value={formData.target_protein}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 font-bold text-lg shadow-sm"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xl py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center w-full md:w-auto"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="elite-glass p-10 rounded-[2rem] shadow-xl border-rose-200/50 bg-rose-50/80">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Danger Zone</h3>
        <p className="text-slate-600 font-medium mb-6">Reset your budget and start fresh for a new month by clearing all your past orders.</p>
        
        <button 
          onClick={handleClearOrders}
          disabled={clearing}
          className="bg-white hover:bg-rose-100 text-rose-600 border border-rose-200 disabled:opacity-50 font-black text-lg py-3 px-8 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={20} />
          {clearing ? "Clearing..." : "Clear All Order History"}
        </button>
      </div>
    </div>
  );
}
