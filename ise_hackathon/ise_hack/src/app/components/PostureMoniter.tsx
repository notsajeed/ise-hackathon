// src/components/PostureMonitor.tsx
"use client";

export default function PostureMonitor() {
  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center p-8">
      <div className="text-white text-center max-w-md">
        <h2 className="text-4xl font-bold mb-6">🧍 Posture Monitor</h2>
        <p className="text-xl opacity-90 mb-8">Real-time AI posture detection</p>
        <div className="grid grid-cols-2 gap-4 text-lg mb-6">
          <div className="bg-white/20 p-4 rounded-xl">Neck Angle<br/><span className="text-2xl font-bold text-green-300">12.3°</span></div>
          <div className="bg-white/20 p-4 rounded-xl">Torso Angle<br/><span className="text-2xl font-bold text-blue-300">8.7°</span></div>
        </div>
        <div className="bg-white/30 p-6 rounded-2xl">
          <div className="text-5xl font-bold text-green-400 mb-2">92%</div>
          <div className="text-sm opacity-75">Posture Score</div>
        </div>
      </div>
    </div>
  );
}
