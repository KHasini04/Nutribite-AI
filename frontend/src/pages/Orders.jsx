import { useState, useEffect } from "react";
import { Receipt, Calendar, CreditCard, ChevronRight, Trash2 } from "lucide-react";
import { getOrders, deleteOrder } from "../api/dataApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      fetchOrders();
      toast.success("Order deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.error("No orders to export");
      return;
    }
    const headers = ["Date", "Restaurant", "Meal", "Amount (INR)", "Calories", "Protein (g)", "Carbs (g)", "Fat (g)"];
    const csvContent = [
      headers.join(","),
      ...orders.map(o => [
        new Date(o.date).toLocaleDateString(),
        `"${o.restaurant}"`,
        `"${o.meal_name}"`,
        o.amount,
        o.calories,
        o.protein,
        o.carbs,
        o.fat
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "nutribite_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported to CSV");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10 elite-glass p-8 rounded-3xl">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 shadow-inner">
          <Receipt size={32} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Order History</h2>
          <p className="text-slate-600 font-bold mt-1 text-lg">Your recent meals and expenses.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl shadow-sm transition flex items-center gap-2"
        >
          Export CSV
        </button>
      </div>

      <div className="elite-glass rounded-3xl overflow-hidden shadow-xl border-white/60 p-2">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold text-xl">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No orders yet</h3>
            <p className="text-slate-500 font-medium text-lg">When you place orders through recommendations, they'll show up here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/40">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-white/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-start sm:items-center gap-5">
                  <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm text-2xl font-black text-slate-800">
                    {order.restaurant.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">{order.meal_name}</h4>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> {new Date(order.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><CreditCard size={14} className="text-slate-400" /> {order.restaurant}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 sm:pl-4 sm:border-l border-white/40">
                  <div className="text-right">
                    <p className="font-black text-2xl text-slate-900 tracking-tight">₹{order.amount}</p>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Completed</p>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, order.id)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Order"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
