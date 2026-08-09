export const SidebarLink = ({ icon, label, count, active, badge, highlight, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
      active ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {badge && <span className="bg-orange-500/20 text-orange-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">{badge}</span>}
    </div>
    {count && (
      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
        highlight ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400'
      }`}>
        {count}
      </span>
    )}
  </div>
);