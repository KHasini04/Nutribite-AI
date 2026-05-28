import { useState, useEffect } from "react";
import { Wallet, PieChart, TrendingUp, Activity, Utensils, Droplets, Plus, Minus } from "lucide-react";
import { getOrders } from "../api/dataApi";
import { Link } from "react-router-dom";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [waterGlasses, setWaterGlasses] = useState(() => {
    return parseInt(localStorage.getItem("water_tracker") || "0");
  });

  useEffect(() => {
    localStorage.setItem("water_tracker", waterGlasses.toString());
  }, [waterGlasses]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="p-8 text-slate-800 font-bold">Loading...</div>;

  const budget = user.monthly_budget || 0;
  const spent = orders.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = budget - spent;

  const chartData = [
    { name: 'Spent', value: spent },
    { name: 'Remaining', value: Math.max(remaining, 0) }
  ];
  const COLORS = ['#f97316', '#10b981']; // orange-500, emerald-500

  const totalProtein = orders.reduce((acc, curr) => acc + (curr.protein || 0), 0);
  const totalCarbs = orders.reduce((acc, curr) => acc + (curr.carbs || 0), 0);
  const totalFat = orders.reduce((acc, curr) => acc + (curr.fat || 0), 0);
  const totalCalories = orders.reduce((acc, curr) => acc + (curr.calories || 0), 0);

  const macroData = [
    { name: 'Protein (g)', amount: totalProtein, fill: '#3b82f6' }, // blue-500
    { name: 'Carbs (g)', amount: totalCarbs, fill: '#eab308' },   // yellow-500
    { name: 'Fat (g)', amount: totalFat, fill: '#ef4444' }        // red-500
  ];

  const targetCalories = user.target_calories || 2000;
  const targetProtein = user.target_protein || 100;
  const calPercent = Math.min((totalCalories / targetCalories) * 100, 100);
  const proPercent = Math.min((totalProtein / targetProtein) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end bg-white/95 p-8 rounded-3xl backdrop-blur-md border border-white shadow-md mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900">Welcome back, {user.name.split(' ')[0]}!</h2>
          <p className="text-slate-700 font-bold mt-2 text-lg">Here is your nutrition and spending summary.</p>
        </div>
        <Link to="/recommendations" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl shadow-lg font-black transition inline-block text-lg">
          New Recommendation
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="elite-glass p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 font-bold mb-1">Monthly Budget</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">₹{budget}</p>
          </div>
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
            <Wallet size={26} strokeWidth={2.5} />
          </div>
        </div>

        <div className="elite-glass p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 font-bold mb-1">Total Spent</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">₹{spent}</p>
          </div>
          <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
            <PieChart size={26} strokeWidth={2.5} />
          </div>
        </div>

        <div className="elite-glass p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-600 font-bold mb-1">Remaining</p>
            <p className={`text-3xl font-black tracking-tight ${remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              ₹{remaining}
            </p>
          </div>
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
            <TrendingUp size={26} strokeWidth={2.5} />
          </div>
        </div>

        <div className="elite-glass p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <p className="text-slate-600 font-bold">Water Tracker</p>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
              <Droplets size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition"
            >
              <Minus size={18} strokeWidth={3} />
            </button>
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{waterGlasses}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Glasses</p>
            </div>
            <button 
              onClick={() => setWaterGlasses(waterGlasses + 1)}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md transition"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="elite-glass p-6 flex flex-col">
          <h3 className="text-xl font-black text-slate-900 mb-2">Budget Overview</h3>
          <div className="flex-1 min-h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${value}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm font-bold text-slate-700">Spent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-bold text-slate-700">Remaining</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 elite-glass p-6">
          <h3 className="text-xl font-black text-slate-900 mb-4">Recent Orders</h3>
          {orders.length === 0 ? (
            <div className="text-center py-10 bg-white/50 rounded-xl border border-white/60">
              <Utensils className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="text-slate-700 font-bold">No orders yet</p>
              <p className="text-sm text-slate-600 font-medium">Your recent meals will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-4 rounded-xl bg-white/80 shadow-sm border border-white/40 hover:bg-white transition cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black shadow-inner">
                      {order.restaurant.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{order.meal_name}</p>
                      <p className="text-sm text-slate-600 font-medium">
                        {order.protein || 0}g P • {order.carbs || 0}g C • {order.fat || 0}g F
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">₹{order.amount}</p>
                    <p className="text-sm text-emerald-600 font-bold">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="elite-glass flex flex-col p-6 space-y-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-xl font-black text-slate-900">Calories</h3>
              <p className="text-sm font-bold text-slate-500">{totalCalories} / {targetCalories} kcal</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${calPercent > 90 ? 'bg-rose-500' : 'bg-orange-500'}`}
                style={{ width: `${calPercent}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-xl font-black text-slate-900">Protein</h3>
              <p className="text-sm font-bold text-slate-500">{totalProtein} / {targetProtein} g</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${proPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex-1 min-h-[150px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748b' }} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={40}>
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
