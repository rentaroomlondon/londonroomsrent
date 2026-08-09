// ================= IconButton.jsx =================
export const IconButton = ({ icon, badge }) => (
  <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 relative shadow-sm cursor-pointer hover:bg-gray-50">
    {icon}
    {badge && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 border-2 border-white rounded-full" />}
  </div>
);
