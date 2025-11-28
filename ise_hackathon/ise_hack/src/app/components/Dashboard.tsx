// src/app/components/Dashboard.tsx
"use client";

export default function Dashboard() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/20 min-h-[200px]">
      <h3 className="text-xl font-bold mb-4">📊 Today</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-400">92%</div>
          <div className="text-xs opacity-75">Avg Score</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">14</div>
          <div className="text-xs opacity-75">Alerts</div>
        </div>
      </div>
    </div>
  );
}
