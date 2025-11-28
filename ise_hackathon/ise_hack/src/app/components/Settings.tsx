"use client";
import React, { useEffect, useState } from "react";
import StorageService from "../lib/services/StorageService";

export default function Settings() {
  const [sensitivity, setSensitivity] = useState<number>(0.5);
  const [uploadOptIn, setUploadOptIn] = useState<boolean>(false);

  useEffect(() => {
    const s = StorageService.get("sensitivity") ?? 0.5;
    setSensitivity(s);
    const up = StorageService.get("uploadOptIn") ?? false;
    setUploadOptIn(up);
  }, []);

  function save() {
    StorageService.set("sensitivity", sensitivity);
    StorageService.set("uploadOptIn", uploadOptIn);
    // persist to server settings optionally
    fetch("/api/settings?userId=demo_user").catch(() => {});
  }

  return (
    <div className="settings-card">
      <h3>Settings</h3>
      <label>Sensitivity</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={sensitivity}
        onChange={(e) => setSensitivity(Number(e.target.value))}
      />
      <div style={{ marginTop: 8 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={uploadOptIn}
            onChange={(e) => setUploadOptIn(e.target.checked)}
          />{" "}
          Upload metrics to server (opt-in)
        </label>
      </div>
      <div className="settings-actions" style={{ marginTop: 10 }}>
        <button onClick={save}>Save</button>
      </div>
    </div>
  );
}
