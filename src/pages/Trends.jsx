import { useMemo } from "react";
import { useLogs } from "../hooks/useLogs";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const PHASE_COLORS = {
  menstrual:  "#e8637a",
  follicular: "#f0a500",
  ovulation:  "#3dba8a",
  luteal:     "#7b6fd6",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "8px 14px",
        fontSize: "0.85rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontWeight: 600, color: "var(--plum)", marginBottom: 2 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function Trends() {
  const { logs, cycleLengthHistory, symptomStats, avgCycleLength } = useLogs();

  // Flow intensity over time (last 20 logs with flow)
  const flowData = useMemo(() => {
    const flowScore = { spotting: 1, light: 2, medium: 3, heavy: 4 };
    return logs
      .filter((l) => l.flow && l.flow !== "none")
      .slice(0, 20)
      .reverse()
      .map((l) => {
        const d = l.date?.toDate ? l.date.toDate() : new Date(l.date);
        return {
          date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          flow: flowScore[l.flow] || 0,
          label: l.flow,
        };
      });
  }, [logs]);

  // Top 8 symptoms for bar chart
  const topSymptoms = useMemo(() => symptomStats.slice(0, 8), [symptomStats]);

  // Cycle regularity score (0–100)
  const regularityScore = useMemo(() => {
    if (cycleLengthHistory.length < 2) return null;
    const lengths = cycleLengthHistory.map((c) => c.length);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance =
      lengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, Math.round(100 - stdDev * 10));
  }, [cycleLengthHistory]);

  const empty = logs.length < 3;

  return (
    <div className="page">
      <h1 className="page-title">Trends</h1>
      <p className="page-sub">Your cycle data visualised over time</p>

      {empty && (
        <div
          style={{
            background: "var(--rose-pale)",
            border: "1px solid var(--rose-light)",
            borderRadius: "var(--radius-sm)",
            padding: "14px 18px",
            marginBottom: 24,
            fontSize: "0.9rem",
            color: "var(--plum)",
          }}
        >
          📈 Log at least 2 full cycles to see trend charts populate.
        </div>
      )}

      {/* Stats row */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card-sm" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--rose)" }}>
            {avgCycleLength}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>avg cycle (days)</div>
        </div>
        <div className="card-sm" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--plum)" }}>
            {cycleLengthHistory.length}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>cycles tracked</div>
        </div>
        <div className="card-sm" style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: regularityScore !== null
                ? regularityScore >= 70 ? "var(--ovulation)" : regularityScore >= 40 ? "var(--follicular)" : "var(--rose)"
                : "var(--text-muted)",
            }}
          >
            {regularityScore !== null ? `${regularityScore}%` : "—"}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>regularity score</div>
        </div>
      </div>

      {/* Cycle length chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.1rem", color: "var(--plum)", marginBottom: 6 }}>
          Cycle length history
        </h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 16 }}>
          Days between each period start
        </p>
        {cycleLengthHistory.length < 2 ? (
          <div className="empty" style={{ padding: "24px 0" }}>
            <p>Not enough data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cycleLengthHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="cycle"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["dataMin - 3", "dataMax + 3"]}
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="length"
                stroke="var(--rose)"
                strokeWidth={2.5}
                dot={{ fill: "var(--rose)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
                name="Days"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Flow intensity chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.1rem", color: "var(--plum)", marginBottom: 6 }}>
          Flow intensity over time
        </h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 16 }}>
          1 = spotting · 2 = light · 3 = medium · 4 = heavy
        </p>
        {flowData.length < 2 ? (
          <div className="empty" style={{ padding: "24px 0" }}>
            <p>No flow data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={flowData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 4]}
                ticks={[1, 2, 3, 4]}
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
                width={20}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="flow" radius={[4, 4, 0, 0]} name="Intensity">
                {flowData.map((_, i) => (
                  <Cell key={i} fill="#e8637a" fillOpacity={0.6 + (i / flowData.length) * 0.4} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top symptoms bar */}
      <div className="card">
        <h2 style={{ fontSize: "1.1rem", color: "var(--plum)", marginBottom: 6 }}>
          Symptom frequency
        </h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 16 }}>
          How often each symptom appears across all logs
        </p>
        {topSymptoms.length === 0 ? (
          <div className="empty" style={{ padding: "24px 0" }}>
            <p>No symptoms logged yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={topSymptoms}
              layout="vertical"
              barSize={14}
              margin={{ left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Times logged" fill="var(--plum)" fillOpacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}