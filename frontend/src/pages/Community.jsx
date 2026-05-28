import { useState, useEffect } from "react";
import { Users, Trophy, Flame, Crown, Medal, ArrowUp, Zap, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Community() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  if (!user) return <div className="p-8 font-bold">Loading Community...</div>;

  const mockLeaderboard = [
    { id: 1, name: "Rahul Sharma", streak: 12, score: 9850, isUser: false, avatar: "R" },
    { id: 2, name: "Priya Patel", streak: 9, score: 8420, isUser: false, avatar: "P" },
    { id: 3, name: user.name || "You", streak: 7, score: 7100, isUser: true, avatar: user.name ? user.name.charAt(0).toUpperCase() : "U" },
    { id: 4, name: "Ananya Desai", streak: 5, score: 5300, isUser: false, avatar: "A" },
    { id: 5, name: "Vikram Singh", streak: 2, score: 2100, isUser: false, avatar: "V" },
  ];

  const activities = [
    { user: "Priya", action: "unlocked the 'Macro Master' badge!", time: "2 hours ago", icon: <Trophy className="text-yellow-500" size={16} /> },
    { user: "Rahul", action: "hit a 12-day perfect protein streak.", time: "4 hours ago", icon: <Flame className="text-orange-500" size={16} /> },
    { user: "Ananya", action: "just ordered a high-protein lunch.", time: "5 hours ago", icon: <Zap className="text-blue-500" size={16} /> }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white/95 p-8 rounded-3xl backdrop-blur-md border border-white shadow-md gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Users className="text-orange-500 w-10 h-10" /> Community
          </h2>
          <p className="text-slate-700 font-bold mt-2 text-lg">Compete with friends and stay motivated.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Badges */}
        <div className="space-y-8">
          
          {/* Your Stats */}
          <div className="elite-glass p-8 rounded-[2rem] shadow-xl border-orange-200/50 bg-gradient-to-br from-orange-50/80 to-white/90">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Flame className="text-orange-500" /> Your Streak
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <div className="text-center">
                  <p className="text-4xl font-black tracking-tighter leading-none">7</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Days</p>
                </div>
              </div>
              <div>
                <p className="text-slate-600 font-bold text-sm">Current Rank</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">#3</p>
                <p className="text-emerald-600 font-bold text-sm mt-1 flex items-center gap-1"><ArrowUp size={14} /> moving up!</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="elite-glass p-8 rounded-[2rem] shadow-xl border-white/80 bg-white/95">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Medal className="text-yellow-500" /> Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Trophy size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">Macro Master</h4>
                  <p className="text-xs font-bold text-slate-500">Hit your protein goal 5 days in a row.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">Budget Saver</h4>
                  <p className="text-xs font-bold text-slate-500">Stayed under budget for 1 week.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-300 opacity-60">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center shadow-sm">
                  <Crown size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">Nutrition King</h4>
                  <p className="text-xs font-bold text-slate-500">Reach Rank #1 on the leaderboard.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Middle/Right Column: Leaderboard */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="elite-glass p-8 rounded-[2rem] shadow-xl border-white/80 bg-white/95">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Global Leaderboard</h3>
              <select className="bg-slate-100 border-none font-bold text-slate-600 text-sm py-2 px-4 rounded-xl outline-none">
                <option>This Week</option>
                <option>This Month</option>
                <option>All Time</option>
              </select>
            </div>

            <div className="space-y-3">
              {mockLeaderboard.map((person, index) => (
                <div 
                  key={person.id} 
                  className={`flex items-center justify-between p-5 rounded-2xl transition-all ${
                    person.isUser 
                      ? 'bg-orange-50 border-2 border-orange-500 shadow-md transform scale-[1.02]' 
                      : 'bg-white border border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`font-black text-xl w-8 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-700' : 'text-slate-300'}`}>
                      #{index + 1}
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner ${
                      person.isUser ? 'bg-orange-500' : 'bg-slate-900'
                    }`}>
                      {person.avatar}
                    </div>
                    <div>
                      <h4 className={`font-black text-lg ${person.isUser ? 'text-orange-700' : 'text-slate-900'}`}>
                        {person.name} {person.isUser && "(You)"}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Flame size={12} className="text-orange-500" /> {person.streak} Day Streak
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-2xl text-slate-900 tracking-tight">{person.score}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="elite-glass p-8 rounded-[2rem] shadow-xl border-white/80 bg-white/95">
             <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="text-blue-500" /> Friend Activity
            </h3>
            <div className="space-y-6">
              {activities.map((act, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                    {act.icon}
                  </div>
                  <div>
                    <p className="text-slate-800 font-medium">
                      <span className="font-black">{act.user}</span> {act.action}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
