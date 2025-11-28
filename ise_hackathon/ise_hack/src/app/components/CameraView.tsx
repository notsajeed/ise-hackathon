"use client";
import React, { useEffect, useRef, useState } from "react";
import CameraService from "../lib/services/CameraService";
import PoseService from "../lib/services/PoseService";
import AnalysisService from "../lib/services/AnalysisService";

export default function CameraView() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const stream = await CameraService.startCamera();
        if (!mounted) return;
        if (videoRef.current) videoRef.current.srcObject = stream;
        await PoseService.init();
        // play video
        if (videoRef.current) await videoRef.current.play();
        // loop
        const loop = async () => {
          if (!mounted) return;
          const v = videoRef.current;
          if (v && v.readyState >= 2) {
            const landmarks = await PoseService.estimate(v);
            if (landmarks) {
              drawOverlay(landmarks);
              AnalysisService.consume(landmarks);
            }
          }
          setTimeout(loop, 200); // ~5 FPS processing
        };
        loop();
      } catch (e) {
        console.error("camera init", e);
        setPermissionDenied(true);
      }
    };
    init();
    return () => {
      mounted = false;
      CameraService.stopCamera();
    };
  }, []);

  function drawOverlay(landmarks: Array<any>) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    for (const lm of landmarks) {
      const x = lm.x * canvas.width;
      const y = lm.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return (
    <div className="camera-card">
      <div className="camera-header">Live Camera</div>
      <div className="camera-wrap">
        <video ref={videoRef} className="camera-video" playsInline muted />
        <canvas ref={canvasRef} className="camera-canvas" />
      </div>
      {permissionDenied && (
        <div className="permission-error">
          Camera permission denied. Enable camera to start monitoring.
        </div>
      )}
    </div>
  );
}
