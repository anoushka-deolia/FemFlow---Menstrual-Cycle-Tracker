import { useMemo } from "react";
import { useLogs } from "../hooks/useLogs";

const PHASES = ["menstrual", "follicular", "ovulation", "luteal"];
const PHASE_COLORS = {
  menstrual:  "var(--menstrual)",
  follicular: "var(--follicular)",
  ovulation:  "var(--ovulation)",
  luteal:     "var(--luteal)",
};

function getPhase(cycleDay, avgLen) {
  if (cycleDay <= 5) return "menstrual";
  if (cycleDay <= 13) return "follicular";
  if (cycleDay <= 16) return "ovulation";
  if (cycleDay <= avgLen) return "luteal";
  return null;
}

export default function Insights() {
  const { logs, symptomStats, avgCycleLength, currentPhase } = useLogs();

  // Mood frequency
  const moodStats = useMemo(() => {
    const map = {};
    logs.forEach((l) => { if (l.mood) map[l.mood] = (map[l.mood] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [logs]);

  // Symptom × phase matrix
  const phaseSymptomMap = useMemo(() => {
    const matrix = {};
    PHASES.forEach((p) => (matrix[p] = {}));

    // Identify period starts
    const starts = logs
      .filter((l) => l.flow && l.flow !== "none")
      .map((l) => ({ ...l, d: l.date?.toDate ? l.date.toDate() : new Date(l.date) }))
      .sort((a, b) => a.d - b.d);

    if (starts.length < 2) return matrix;

    logs.forEach((l) => {
      const ld = l.date?.toDate ? l.date.toDate() : new Date(l.date);
      // find which cycle this belongs to
      for (let i = starts.length - 1; i >= 0; i--) {
        if (ld >= starts[i].d) {
          const cycleDay = Math.round((ld - starts[i].d) / 86400000) + 1;
          const phase = getPhase(cycleDay, avgCycleLength);
          if (phase && l.symptoms) {
            l.symptoms.forEach((s) => {
              matrix[phase][s] = (matrix[phase][s] || 0) + 1;
            });
          }
          break;
        }
      }
    });
    return matrix;
  }, [logs, avgCycleLength]);

  const totalLogs = logs.length;

  return (
    <div className="page">
      <h1 className="page-title">Insights</h1>
      <p className="page-sub">Patterns from your {totalLogs} logged days</p>

      {totalLogs < 3 && (
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
          💡 Log at least 7–10 days to unlock meaningful pattern insights.
        </div>
      )}

      {/* Current phase tip */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.1rem", color: "var(--plum)", marginBottom: 12 }}>
          You're in the <span style={{ textTransform: "capitalize" }}>{currentPhase}</span> phase
        </h2>
        <PhaseAdvice phase={currentPhase} />
      </div>

      {/* Top symptoms */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.1rem", color: "var(--plum)", marginBottom: 16 }}>
          Most logged symptoms
        </h2>
        {symptomStats.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No symptoms logged yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {symptomStats.slice(0, 8).map(({ name, count }) => {
              const pct = Math.round((count / totalLogs) * 100);
              return (
                <div key={name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{name}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{count}×</span>
                  </div>
                  <div style={{ background: "var(--blush)", borderRadius: 50, height: 6 }}>
                    <div
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        height: "100%",
                        background: "var(--rose)",
                        borderRadius: 50,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mood distribution */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.1rem", color: "var(--plum)", marginBottom: 14 }}>
          Mood patterns
        </h2>
        {moodStats.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No moods logged yet.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {moodStats.map(([mood, count]) => (
              <div
                key={mood}
                style={{
                  background: "var(--blush)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "10px 16px",
                  textAlign: "center",
                  minWidth: 90,
                }}
              >
                <div style={{ fontSize: "1.4rem" }}>{mood.split(" ")[1] || "😐"}</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 500, marginTop: 2 }}>
                  {mood.split(" ")[0]}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{count}×</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Symptom × phase matrix */}
      <div className="card">
        <h2 style={{ fontSize: "1.1rem", color: "var(--plum)", marginBottom: 14 }}>
          Symptoms by phase
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {PHASES.map((phase) => {
            const entries = Object.entries(phaseSymptomMap[phase] || {})
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4);
            return (
              <div
                key={phase}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    textTransform: "capitalize",
                    fontSize: "0.88rem",
                    color: PHASE_COLORS[phase],
                    marginBottom: 8,
                  }}
                >
                  {phase}
                </div>
                {entries.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No data</p>
                ) : (
                  entries.map(([sym, cnt]) => (
                    <div
                      key={sym}
                      style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 2 }}
                    >
                      {sym} <span style={{ color: PHASE_COLORS[phase] }}>×{cnt}</span>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PhaseAdvice({ phase }) {
  const tips = {
    menstrual: ["Rest more than usual", "Apply heat for cramps", "Iron-rich foods help", "Gentle movement like walks"],
    follicular: ["Great time to start projects", "Energy is building — exercise more", "Social energy is high", "Try something new"],
    ovulation: ["Peak physical performance", "Confidence is highest now", "Best time for important conversations", "High libido is normal"],
    luteal: ["Cravings for carbs are normal", "Prioritise sleep", "Journaling helps with mood", "Reduce caffeine intake"],
    unknown: ["Start logging to see personalised tips"],
  };
  return (
    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
      {(tips[phase] || tips.unknown).map((t) => (
        <li key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--rose)", marginTop: 2 }}>•</span> {t}
        </li>
      ))}
    </ul>
  );
}