"use client";

import React from "react";
import PostureMonitor from "@/app/components/PostureMoniter"; // Import PostureMonitor
import SessionControls from "./components/SessionControls";
import Alerts from "./components/Alerts";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";

export default function Page() {
  return (
    <div
      className="main-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: 16,
      }}
    >
      <section className="left-col">
        {/* Replace CameraView with PostureMonitor */}
        <PostureMonitor />
      </section>

      <aside
        className="right-col"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <SessionControls />
        <Alerts />
        <Dashboard />
        <Settings />
      </aside>
    </div>
  );
}
