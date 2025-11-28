import "./globals.css";
import React from "react";
import type { ReactNode } from "react";

export const metadata = {
  title: "Posture Monitor",
  description:
    "Privacy-first posture monitor — on-device pose, lightweight, minimal UI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div
          style={{
            minHeight: "100vh",
            background: "var(--bg)",
            color: "#e6e6e6",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "24px auto",
              padding: 18,
            }}
          >
            <header
              className="topbar"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <h1 style={{ margin: 0, fontSize: 20 }}>Posture Monitor</h1>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>
                  Minimal • On-device
                </span>
              </div>

              <div
                className="status-pill"
                style={{ fontSize: 13, color: "var(--muted)" }}
              >
                Status: <strong>Idle</strong>
              </div>
            </header>

            <main>{children}</main>

            <footer
              className="footer"
              style={{ marginTop: 16, color: "var(--muted)", fontSize: 13 }}
            >
              Privacy-first — processing on-device by default. No images
              uploaded unless you opt in.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
