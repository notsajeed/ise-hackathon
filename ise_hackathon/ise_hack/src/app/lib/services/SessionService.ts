// src/app/lib/services/SessionService.ts
"use client";

import AnalysisService from "./AnalysisService";
import StorageService from "./StorageService";

const SessionService = (() => {
  let sessionId: string | null = null;
  let userId = "demo_user";
  let intervalMs = 15_000;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let isRunning = false;
  let statusCb: (s: any) => void = () => {};

  function startSession(opts: { userId?: string; intervalMs?: number } = {}) {
    if (isRunning) return;
    userId = opts.userId || userId;
    intervalMs = opts.intervalMs ?? intervalMs;
    sessionId = `s_${Date.now()}`;
    isRunning = true;
    schedule();
    statusCb({ running: true, sessionId });
  }

  function stopSession() {
    isRunning = false;
    if (timer) clearTimeout(timer);
    timer = null;
    statusCb({ running: false, sessionId: null });
  }

  function schedule() {
    timer = setTimeout(async () => {
      try {
        const snapshot = AnalysisService.getLatestSnapshot();
        if (snapshot && StorageService.get("uploadOptIn")) {
          await pushSnapshot({ ...snapshot });
        }
      } catch (e) {
        console.error("SessionService schedule error:", e);
      } finally {
        if (isRunning) schedule();
      }
    }, intervalMs);
  }

  async function pushSnapshot({
    posture = "ok",
    confidence = null,
    durationSeconds = null,
    imageBase64 = null,
  }: any) {
    const payload = {
      userId,
      posture,
      confidence,
      durationSeconds,
      imageBase64,
      timestamp: new Date().toISOString(),
    };
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error("pushSnapshot error:", e);
    }
  }

  function setStatusCallback(cb: (s: any) => void) {
    statusCb = cb;
  }

  return { startSession, stopSession, setStatusCallback, pushSnapshot };
})();

export default SessionService;
