import { useState } from "react";
import { useLogs } from "../hooks/useLogs";
import ButtonGroup from "../components/ButtonGroup";

const FLOW_OPTIONS = ["spotting", "light", "medium", "heavy"];
const MOOD_OPTIONS = ["Happy 😊", "Calm 😌", "Tired 😴", "Anxious 😟", "Irritable 😤", "Sad 😢", "Energetic ⚡"];
const SYMPTOM_OPTIONS = [
  "Cramps", "Headache", "Bloating", "Back pain",
  "Breast tenderness", "Acne", "Nausea", "Cravings",
  "Insomnia", "Brain fog",
];

const PHASE_INFO = {
  menstrual:  { color: "var(--menstrual)",  bg: "#fde8ec", desc: "Your period. Rest, nourish yourself." },
  follicular: { color: "var(--follicular)", bg: "#fff5e0", desc: "Energy rising. Great time to start new things." },
  ovulation:  { color: "var(--ovulation)",  bg: "#e8f8f2", desc: "Peak energy and confidence. You're glowing!" },
  luteal:     { color: "var(--luteal)",     bg: "#ede9fb", desc: "Wind down, prioritise self-care." },
  unknown:    { color: "var(--text-muted)", bg: "var(--blush)", desc: "Log your period to see predictions." },
};

export default function Dashboard() {
  const {
    createLog, currentCycleDay, currentPhase,
    nextPeriod, avgCycleLength, ovulationWindow,
  } = useLogs();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [flow, setFlow] = useState("");
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const phase = PHASE_INFO[currentPhase] || PHASE_INFO.unknown;

  const daysUntilNext = nextPeriod
    ? Math.max(0, Math.round((nextPeriod - new Date()) / 86400000))
    : null;

  const handleSave = async () => {
    if (!flow && !mood && symptoms.length === 0 && !notes) return;
    setSaving(true);
    await createLog({ date, flow, mood, symptoms, notes });
    setSaved(true);
    setFlow(""); setMood(""); setSymptoms([]); setNotes("");
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">Good day 🌸</h1>
      <p className="page-sub">Here's your cycle overview</p>

      {/* Phase banner */}
      <div
        style={{
          background: phase.bg,
          border: `1.5px solid ${phase.color}30`,
          borderRadius: "var(--radius)",
          padding: "20px 24px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span
              style={{
                background: phase.color,
                color: "#fff",
                borderRadius: 50,
                padding: "3px 14px",
                fontSize: "0.82rem",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {currentPhase} phase
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{phase.desc}</p>
        </div>
        {currentCycleDay && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: phase.color, lineHeight: 1 }}>
              {currentCycleDay}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              day of cycle
            </div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card-sm" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--rose)" }}>
            {daysUntilNext !== null ? daysUntilNext : "—"}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            days until next period
          </div>
        </div>
        <div className="card-sm" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--plum)" }}>
            {avgCycleLength}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>avg cycle length</div>
        </div>
        <div className="card-sm" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--ovulation)" }}>
            {ovulationWindow
              ? ovulationWindow.start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
              : "—"}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>ovulation window</div>
        </div>
      </div>

      {/* Quick log */}
      <div className="card">
        <h2 style={{ fontSize: "1.2rem", color: "var(--plum)", marginBottom: 20 }}>
          Log today
        </h2>

        <div style={{ marginBottom: 16 }}>
          <label>Date</label>
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ maxWidth: 200 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Flow intensity</label>
          <ButtonGroup options={FLOW_OPTIONS} value={flow} onChange={setFlow} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Mood</label>
          <ButtonGroup options={MOOD_OPTIONS} value={mood} onChange={setMood} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Symptoms</label>
          <ButtonGroup options={SYMPTOM_OPTIONS} value={symptoms} onChange={setSymptoms} multi />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Anything you want to remember…"
            style={{ resize: "vertical" }}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || (!flow && !mood && symptoms.length === 0 && !notes)}
        >
          {saved ? "✓ Saved!" : saving ? "Saving…" : "Save entry"}
        </button>
      </div>
    </div>
  );
}