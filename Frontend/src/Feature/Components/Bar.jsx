export default function Bar({ value = 0, label }) {
  const safe = Math.min(100, Math.max(0, value));

  const getLabel = () => {
    if (safe > 90) return "NAILED IT 🚀";
    if (safe > 75) return "STRONG 💪";
    if (safe > 50) return "GOOD 👍";
    if (safe > 25) return "FAIR ⚡";
    return "LOW ⚠";
  };

  const getColor = () => {
    if (safe > 75) return "bg-green-500";
    if (safe > 50) return "bg-blue-500";
    if (safe > 25) return "bg-yellow-200";
    return "bg-red-400";
  };

  return (
    <div className="w-full mt-4">
      {/* Top Row */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold opacity-70">{label}</span>
        <span className="text-xs font-bold">{safe}%</span>
      </div>

      {/* Bar Track */}
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
        {/* Progress */}
        <div
          className={`h-full rounded-full transition-all duration-700 ${getColor()}`}
          style={{ width: `${safe}%` }}
        />
      </div>

      {/* Bottom Label */}
      <div className="text-[10px] mt-1 opacity-60">{getLabel()}</div>
    </div>
  );
}
