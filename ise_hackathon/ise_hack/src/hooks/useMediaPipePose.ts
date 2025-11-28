// src/hooks/useMediaPipePose.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

interface PoseLandmarks {
  nose: { x: number; y: number; z: number };
  leftShoulder: { x: number; y: number; z: number };
  rightShoulder: { x: number; y: number; z: number };
  leftHip: { x: number; y: number; z: number };
  rightHip: { x: number; y: number; z: number };
}

export const useMediaPipePose = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [landmarks, setLandmarks] = useState<PoseLandmarks | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  // FIX: Declare this first
  const onPoseResults = useCallback((results: Results) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      drawConnectors(ctx, results.poseLandmarks, [
        [11, 12], [11, 23], [12, 24], [23, 24]
      ], { color: '#00FF00', lineWidth: 2 });

      drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000' });

      setLandmarks({
        nose: results.poseLandmarks[0],
        leftShoulder: results.poseLandmarks[11],
        rightShoulder: results.poseLandmarks[12],
        leftHip: results.poseLandmarks[23],
        rightHip: results.poseLandmarks[24],
      });
    }
    ctx.restore();
  }, []);

  const startCamera = useCallback(async () => {
    if (videoRef.current && canvasRef.current) {
      const pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(onPoseResults);

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (poseRef.current && videoRef.current) {
            await poseRef.current.send({ image: videoRef.current });
          }
        },
      });

      poseRef.current = pose;
      cameraRef.current = camera;
      camera.start();
    }
  }, [onPoseResults]);

  useEffect(() => {
    startCamera();
    return () => cameraRef.current?.stop();
  }, [startCamera]);

  return { videoRef, canvasRef, landmarks, startCamera };
};
