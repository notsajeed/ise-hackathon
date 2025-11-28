// src/app/components/SessionControls.tsx
"use client";

export default function SessionControls() {
  return (
    <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-6 text-white border border-green-500/30">
      <div className="text-3xl font-bold mb-2">00:12:34</div>
      <div className="text-sm opacity-75">Session Active</div>
      <div className="flex gap-2 mt-4">
        <button className="flex-1 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-all">⏸️ Pause</button>
        <button className="flex-1 bg-red-500/80 px-4 py-2 rounded-xl hover:bg-red-500 transition-all">⏹️ End</button>
      </div>
    </div>
  );
}
