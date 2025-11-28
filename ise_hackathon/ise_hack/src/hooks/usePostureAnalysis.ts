// src/hooks/usePostureAnalysis.ts
import { useEffect, useState } from 'react';

interface PostureMetrics {
  neckAngle: number;
  torsoAngle: number;
  shoulderForwardness: number;
  postureScore: number;
  alert: string | null;
}

export const usePostureAnalysis = (landmarks: any) => {
  const [metrics, setMetrics] = useState<PostureMetrics>({
    neckAngle: 0,
    torsoAngle: 0,
    shoulderForwardness: 0,
    postureScore: 100,
    alert: null,
  });

  const calculateNeckAngle = (shoulders: any, nose: any) => {
    const shoulderMid = {
      x: (shoulders.leftShoulder.x + shoulders.rightShoulder.x) / 2,
      y: (shoulders.leftShoulder.y + shoulders.rightShoulder.y) / 2,
    };
    const neckVector = {
      x: nose.x - shoulderMid.x,
      y: nose.y - shoulderMid.y,
    };
    const angleRad = Math.atan2(neckVector.x, neckVector.y);
    return Math.abs(angleRad * 180 / Math.PI);
  };

  const calculateTorsoAngle = (shoulders: any, hips: any) => {
    const shoulderMid = {
      x: (shoulders.leftShoulder.x + shoulders.rightShoulder.x) / 2,
      y: (shoulders.leftShoulder.y + shoulders.rightShoulder.y) / 2,
    };
    const hipMid = {
      x: (hips.leftHip.x + hips.rightHip.x) / 2,
      y: (hips.leftHip.y + hips.rightHip.y) / 2,
    };
    const torsoVector = {
      x: shoulderMid.x - hipMid.x,
      y: shoulderMid.y - hipMid.y,
    };
    const angleRad = Math.atan2(torsoVector.x, torsoVector.y);
    return Math.abs(angleRad * 180 / Math.PI);
  };

  useEffect(() => {
    if (landmarks) {
      const neckAngle = calculateNeckAngle(landmarks, landmarks.nose);
      const torsoAngle = calculateTorsoAngle(landmarks, landmarks);
      const shoulderForwardness = (landmarks.leftShoulder.x + landmarks.rightShoulder.x) / 2 - 
                                 (landmarks.leftHip.x + landmarks.rightHip.x) / 2;

      const postureScore = Math.max(0, 100 - (neckAngle + torsoAngle) * 2);
      
      let alert = null;
      if (neckAngle > 15 || torsoAngle > 12) {
        alert = neckAngle > torsoAngle ? 'Forward head detected' : 'Torso slouch detected';
      }

      setMetrics({
        neckAngle: Math.round(neckAngle * 10) / 10,
        torsoAngle: Math.round(torsoAngle * 10) / 10,
        shoulderForwardness: Math.round(shoulderForwardness * 1000) / 1000,
        postureScore: Math.round(postureScore),
        alert,
      });
    }
  }, [landmarks]);

  return metrics;
};
