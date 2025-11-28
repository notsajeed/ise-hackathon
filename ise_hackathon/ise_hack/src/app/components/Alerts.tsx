// src/app/components/Alerts.tsx
"use client";

export default function Alerts() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/20 min-h-[150px]">
      <h3 className="text-xl font-bold mb-4">🔔 Alerts</h3>
      <div className="space-y-2 text-sm opacity-90">
        <div className="flex gap-2 p-2 bg-red-500/20 rounded-lg">
          <span>🚨</span>
          <span>Forward head detected (11:23 AM)</span>
        </div>
        <div className="flex gap-2 p-2 bg-yellow-500/20 rounded-lg">
          <span>⚠️</span>
          <span>Torso slouch (11:21 AM)</span>
        </div>
      </div>
    </div>
  );
}
