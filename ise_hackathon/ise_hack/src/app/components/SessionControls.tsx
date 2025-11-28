"use client";
import React, { useEffect, useState } from "react";
import SessionService from "../lib/services/SessionService";
import HydrationService from "../lib/services/HydrationService";

export default function SessionControls() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    SessionService.setStatusCallback((s) => setRunning(!!s.running));
    HydrationService.setCallback((note) => {
      // hydration notification - use window alert or custom UI integration
      // we'll emit a simple console / browser notification
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(note.title, { body: note.body });
        } else {
          // fallback small toast (console)
          console.log("Hydration:", note);
        }
      }
    });
  }, []);

  return (
    <div className="session-card">
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() => {
            SessionService.startSession({ userId: "demo_user" });
            HydrationService.start(20);
          }}
          disabled={running}
        >
          Start Focus Session
        </button>
        <button
          onClick={() => {
            SessionService.stopSession();
            HydrationService.stop();
          }}
          disabled={!running}
        >
          Stop
        </button>
      </div>
      <div style={{ marginTop: 8, color: "#9aa0a6", fontSize: 12 }}>
        When running, on-device posture detection will alert you in real-time.
        Uploads happen only when you opt in.
      </div>
    </div>
  );
}
