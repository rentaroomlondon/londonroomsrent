// ================= TenantRow.jsx =================
export const TenantRow = ({ name, address, price, status, color }) => (
  <div className="px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <div>
        <p className="font-bold text-sm text-slate-900">{name}</p>
        <p className="text-[10px] text-gray-400">{address}</p>
      </div>
    </div>

    <div className="text-right">
      <p className="text-orange-500 font-extrabold text-sm">{price}</p>
      <span className="bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border border-gray-100">
        {status}
      </span>
    </div>
  </div>
);