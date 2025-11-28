"use client";
import React, { useEffect, useState } from "react";

type DailyRow = {
  day: string;
  total: number;
  bad_count: number;
  ok_count?: number;
};

export default function Dashboard({
  userId = "demo_user",
}: {
  userId?: string;
}) {
  const [daily, setDaily] = useState<DailyRow[]>([]);
  const [totals, setTotals] = useState<{
    total_events?: number;
    total_bad?: number;
  }>({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/summary?userId=${userId}`);
        const json = await res.json();
        if (!mounted) return;
        setDaily(json.daily || []);
        setTotals(json.totals || {});
      } catch (e) {
        /* ignore */
      }
    }
    load();
    const t = setInterval(load, 60_000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [userId]);

  return (
    <div className="dashboard-card">
      <h3>Overview</h3>
      <div className="metric-row">
        <div className="metric">
          <div className="metric-value">{totals?.total_events ?? 0}</div>
          <div className="metric-label">Events (30d)</div>
        </div>
        <div className="metric">
          <div className="metric-value">{totals?.total_bad ?? 0}</div>
          <div className="metric-label">Bad events</div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <small>Last 7 days</small>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 8,
            alignItems: "end",
            height: 80,
          }}
        >
          {daily.map((d) => {
            const total = Number(d.total || 0);
            const bad = Number(d.bad_count || 0);
            const score =
              total === 0 ? 100 : Math.round((1 - bad / total) * 100);
            return (
              <div key={d.day} style={{ width: 22, textAlign: "center" }}>
                <div
                  style={{
                    height: Math.max(6, score * 0.6),
                    borderRadius: 6,
                    background: "#7ae582",
                  }}
                />
                <div style={{ fontSize: 10, color: "#9aa0a6" }}>
                  {new Date(d.day).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
