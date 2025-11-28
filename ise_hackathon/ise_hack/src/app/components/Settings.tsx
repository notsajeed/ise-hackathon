// src/app/components/Settings.tsx
"use client";

export default function Settings() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/20 min-h-[200px]">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        ⚙️ Settings
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Alert Sensitivity</span>
          <span className="font-mono">Medium</span>
        </div>
        <div className="flex justify-between">
          <span>Sound Alerts</span>
          <span className="font-mono">On</span>
        </div>
        <div className="flex justify-between">
          <span>Auto-pause</span>
          <span className="font-mono">30min</span>
        </div>
        <div className="flex justify-between">
          <span>Model</span>
          <span className="font-mono">MoveNet Lightning</span>
        </div>
      </div>
    </div>
  );
}
