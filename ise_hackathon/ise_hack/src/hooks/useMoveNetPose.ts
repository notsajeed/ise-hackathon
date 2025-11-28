"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

export interface PoseLandmark {
  x: number;
  y: number;
  score?: number;
  name: string;
}

export interface Pose {
  keypoints: PoseLandmark[];
  score?: number;
}

export const useMoveNetPose = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poses, setPoses] = useState<Pose[]>([]);
  const [isReady, setIsReady] = useState(false);
  const detectorRef = useRef<any>(null);
  const rafRef = useRef<number>(0);

  const detectPose = useCallback(async () => {
    if (!videoRef.current || !detectorRef.current) return;

    try {
      const detection = await detectorRef.current.estimatePoses(videoRef.current);
      setPoses(detection);
      
      // Draw on canvas
      if (canvasRef.current && detection.length > 0) {
        drawSkeleton(canvasRef.current, detection[0].keypoints);
      }
    } catch (error) {
      console.error('Detection error:', error);
    }

    rafRef.current = requestAnimationFrame(detectPose);
  }, []);

  const drawSkeleton = (canvas: HTMLCanvasElement, keypoints: PoseLandmark[]) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Skeleton connections (MoveNet indices)
    const connections: [number, number][] = [
      [5, 6], [5, 11], [6, 12], [11, 12], [11, 13], [13, 15], [12, 14], [14, 16]
    ];

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;

    connections.forEach(([i, j]) => {
      const p1 = keypoints[i];
      const p2 = keypoints[j];
      if (p1.score! > 0.3 && p2.score! > 0.3) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });

    // Keypoints
    ctx.fillStyle = '#ff0000';
    keypoints.forEach((kp) => {
      if (kp.score! > 0.3) {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  const initializeDetector = useCallback(async () => {
    try {
      // Dynamic imports - NO SSR issues
      const tf = await import('@tensorflow/tfjs-core');
      const poseDetection = await import('@tensorflow-models/pose-detection');

      await tf.ready();
      await tf.setBackend('webgl');

      detectorRef.current = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
        }
      );

      // Camera setup
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsReady(true);
      detectPose();
    } catch (error) {
      console.error('Failed to initialize MoveNet:', error);
    }
  }, [detectPose]);

  useEffect(() => {
    initializeDetector();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, [initializeDetector]);

  return {
    videoRef,
    canvasRef,
    poses,
    isReady
  };
};
