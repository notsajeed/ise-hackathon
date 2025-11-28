"use client";
import React, { useEffect, useState } from "react";
import AnalysisService from "../lib/services/AnalysisService";

export default function Alerts() {
  const [alert, setAlert] = useState<any | null>(null);

  useEffect(() => {
    const unsub = AnalysisService.onAlert((a) => setAlert(a));
    return () => unsub();
  }, []);

  if (!alert) return <div className="alerts-card small">Posture: OK</div>;

  return (
    <div className={`alerts-card ${alert.level ?? ""}`}>
      <div className="alert-title">{alert.title}</div>
      <div className="alert-body">{alert.message}</div>
      <div className="alert-actions">
        <button onClick={() => AnalysisService.snooze(600)}>Snooze 10m</button>
        <button onClick={() => AnalysisService.acknowledge()}>Dismiss</button>
      </div>
    </div>
  );
}
