import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api/authApi";
import toast from "react-hot-toast";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    monthly_budget: "",
    goal: "Weight Loss",
    food_preference: "Any"
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Name Validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces.";
    }
    
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    // Password Validation
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
    }
    
    // Budget Validation
    if (!formData.monthly_budget) {
      newErrors.monthly_budget = "Monthly budget is required.";
    } else if (isNaN(formData.monthly_budget) || Number(formData.monthly_budget) < 500) {
      newErrors.monthly_budget = "Budget must be a valid number of at least ₹500.";
    }

    // Food Preference Validation
    const validPreferences = ["Any", "Vegetarian", "Vegan", "Non-Vegetarian"];
    if (!formData.food_preference || !validPreferences.includes(formData.food_preference)) {
      newErrors.food_preference = "Please select a valid dietary preference.";
    }

    // Goal Validation
    const validGoals = ["Weight Loss", "Muscle Gain", "Maintenance", "General Health", "High Protein", "Low Carb"];
    if (!formData.goal || !validGoals.includes(formData.goal)) {
      newErrors.goal = "Please select a valid primary goal.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        monthly_budget: formData.monthly_budget ? Number(formData.monthly_budget) : 0,
        food_preference: formData.food_preference,
        goal: formData.goal
      };
      await signupUser(payload);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to create account.");
      setApiError(err.detail || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-50">
      <div className="max-w-xl w-full elite-glass p-10 lg:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Subtle orange glow inside the glass */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-400/20 rounded-full blur-[50px] pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 shadow-xl flex items-center justify-center border-4 border-white/50 text-white">
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h2>
          <p className="text-slate-600 font-bold text-lg">Join NutriBite AI and start your healthy journey</p>
        </div>
        
        {apiError && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl font-bold text-center">
            {apiError}
          </div>
        )}
        
        <form className="space-y-6 relative z-10" onSubmit={handleSignup}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">Full Name</label>
              <input 
                type="text" 
                name="name"
                required 
                minLength={2}
                pattern="^[a-zA-Z\s]*$"
                title="Name can only contain letters and spaces."
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium text-lg shadow-sm"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-rose-600 text-xs mt-2 font-bold">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                name="email"
                required 
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium text-lg shadow-sm"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-rose-600 text-xs mt-2 font-bold">{errors.email}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              name="password"
              required 
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium text-lg shadow-sm"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-rose-600 text-xs mt-2 font-bold">{errors.password}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">Monthly Budget (₹)</label>
              <input 
                type="number" 
                name="monthly_budget"
                required 
                min={500}
                value={formData.monthly_budget}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium text-lg shadow-sm"
                placeholder="e.g. 5000"
              />
              {errors.monthly_budget && <p className="text-rose-600 text-xs mt-2 font-bold">{errors.monthly_budget}</p>}
            </div>
            <div>
              <label className="block text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">Dietary Preference</label>
              <select 
                name="food_preference"
                value={formData.food_preference}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 font-medium text-lg shadow-sm"
              >
                <option value="Any">Any</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
              {errors.food_preference && <p className="text-rose-600 text-xs mt-2 font-bold">{errors.food_preference}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">Primary Goal</label>
            <select 
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 font-medium text-lg shadow-sm"
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintenance">Maintenance</option>
              <option value="General Health">General Health</option>
              <option value="High Protein">High Protein</option>
              <option value="Low Carb">Low Carb</option>
            </select>
            {errors.goal && <p className="text-rose-600 text-xs mt-2 font-bold">{errors.goal}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xl py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center mt-10"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <p className="mt-10 text-center text-slate-600 font-bold relative z-10">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 hover:text-orange-700 transition hover:underline font-black">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
