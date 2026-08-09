// ================= StatCard.jsx =================
export const StatCard = ({ icon, value, label }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4">
    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  </div>
);
