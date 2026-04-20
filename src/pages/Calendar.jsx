import { useMemo, useState } from "react";
import { useLogs } from "../hooks/useLogs";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PHASE_COLORS = {
  menstrual:  { bg: "#fde8ec", border: "#e8637a", dot: "#e8637a" },
  follicular: { bg: "#fff5e0", border: "#f0a500", dot: "#f0a500" },
  ovulation:  { bg: "#e8f8f2", border: "#3dba8a", dot: "#3dba8a" },
  luteal:     { bg: "#ede9fb", border: "#7b6fd6", dot: "#7b6fd6" },
};

function getPhase(cycleDay) {
  if (cycleDay <= 5)  return "menstrual";
  if (cycleDay <= 13) return "follicular";
  if (cycleDay <= 16) return "ovulation";
  return "luteal";
}

export default function Calendar() {
  const { logs, nextPeriod, avgCycleLength } = useLogs();
  const [offset, setOffset] = useState(0); // month offset

  const now = new Date();
  const year  = new Date(now.getFullYear(), now.getMonth() + offset, 1).getFullYear();
  const month = new Date(now.getFullYear(), now.getMonth() + offset, 1).getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build a map: "YYYY-MM-DD" → log
  const logMap = useMemo(() => {
    const map = {};
    logs.forEach((l) => {
      const d = l.date?.toDate ? l.date.toDate() : new Date(l.date);
      const key = d.toISOString().split("T")[0];
      map[key] = l;
    });
    return map;
  }, [logs]);

  // Build phase map for prediction
  const phaseMap = useMemo(() => {
    const map = {};
    if (!nextPeriod) return map;
    // Go 2 months back and 2 months forward
    for (let offset = -60; offset <= 90; offset++) {
      const d = new Date(nextPeriod);
      d.setDate(d.getDate() + offset);
      // Find nearest period start
      const diff = -offset;
      if (diff >= 0 && diff < avgCycleLength) {
        const cycleDay = avgCycleLength - diff;
        const key = d.toISOString().split("T")[0];
        map[key] = getPhase(cycleDay);
      }
    }
    return map;
  }, [nextPeriod, avgCycleLength]);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long", year: "numeric",
  });

  const todayKey = now.toISOString().split("T")[0];

  return (
    <div className="page">
      <h1 className="page-title">Calendar</h1>
      <p className="page-sub">Visualise your cycle at a glance</p>

      {/* Month nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <button className="btn btn-ghost" onClick={() => setOffset((o) => o - 1)}>← Prev</button>
        <span style={{ fontWeight: 600, color: "var(--plum)", fontSize: "1.05rem" }}>{monthName}</span>
        <button className="btn btn-ghost" onClick={() => setOffset((o) => o + 1)}>Next →</button>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.entries(PHASE_COLORS).map(([phase, c]) => (
          <div key={phase} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.dot }} />
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{phase}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--rose)", border: "2px solid var(--plum)" }} />
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Logged</span>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        {/* Weekday headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
          {DAYS.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, padding: "4px 0" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;

            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const log     = logMap[dateKey];
            const phase   = phaseMap[dateKey];
            const isToday = dateKey === todayKey;
            const colors  = phase ? PHASE_COLORS[phase] : null;

            return (
              <div
                key={i}
                title={phase ? `Predicted: ${phase} phase` : ""}
                style={{
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: isToday ? 700 : 400,
                  position: "relative",
                  background: colors ? colors.bg : "transparent",
                  border: isToday ? "2px solid var(--rose)" : colors ? `1px solid ${colors.border}30` : "1px solid transparent",
                  color: isToday ? "var(--rose)" : "var(--text)",
                  cursor: "default",
                }}
              >
                {day}
                {log && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 3,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--rose)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}