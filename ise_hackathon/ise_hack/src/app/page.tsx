"use client";

import React from "react";
import CameraView from "./components/CameraView";
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
        <CameraView />
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
