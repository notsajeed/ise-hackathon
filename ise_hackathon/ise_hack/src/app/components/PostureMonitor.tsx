"use client";

import { useMoveNetPose, Pose } from '../../hooks/useMoveNetPose';
import { useEffect, useState } from 'react';

export default function PostureMonitor() {
  const { videoRef, canvasRef, poses, isReady } = useMoveNetPose();
  const [postureScore, setPostureScore] = useState(100);
  const [metrics, setMetrics] = useState({
    neckAngle: 0,
    torsoAngle: 0,
    shouldersLevel: 0
  });

  useEffect(() => {
    if (poses.length === 0 || !isReady) return;

    const pose = poses[0];
    calculatePosture(pose);
  }, [poses, isReady]);

  const calculatePosture = (pose: Pose) => {
    const keypoints = pose.keypoints;
    
    // Keypoint indices: nose=0, left_shoulder=5, right_shoulder=6, left_hip=11, right_hip=12
    const nose = keypoints[0];
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];

    if (!nose.score || nose.score! < 0.3) return;

    // Neck angle (nose to shoulder midline)
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const neckAngle = Math.abs(
      Math.atan2(nose.x - shoulderMidX, nose.y - shoulderMidY) * 180 / Math.PI
    );

    // Torso angle (shoulder to hip midline)
    const hipMidX = (leftHip.x + rightHip.x) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;
    const torsoAngle = Math.abs(
      Math.atan2(shoulderMidX - hipMidX, shoulderMidY - hipMidY) * 180 / Math.PI
    );

    // Shoulders level
    const shouldersLevel = Math.abs(leftShoulder.y - rightShoulder.y);

    setMetrics({
      neckAngle: +(neckAngle).toFixed(1),
      torsoAngle: +(torsoAngle).toFixed(1),
      shouldersLevel: +(shouldersLevel).toFixed(1)
    });

    // Posture score
    const score = Math.max(0, 100 - (neckAngle * 0.8 + torsoAngle * 1.2 + shouldersLevel * 0.1));
    setPostureScore(+(score).toFixed(0));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-900 to-black min-h-screen">
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        🧍 AI Posture Monitor
      </h1>

      <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-2xl aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          width={640}
          height={480}
        />
        
        {!isReady && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">
              🔄 Initializing MoveNet AI...
            </div>
          </div>
        )}
      </div>

      {/* Metrics Display */}
      {isReady && poses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Neck Angle</h3>
            <div className="text-3xl font-bold text-green-400">{metrics.neckAngle}°</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Torso Angle</h3>
            <div className="text-3xl font-bold text-blue-400">{metrics.torsoAngle}°</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Posture Score</h3>
            <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {postureScore}%
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-gray-400 text-sm">
        Powered by TensorFlow.js MoveNet • No MediaPipe Dependencies
      </div>
    </div>
  );
}
