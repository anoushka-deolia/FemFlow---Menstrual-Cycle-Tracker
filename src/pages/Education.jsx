import { useState } from "react";

const PHASES = [
  {
    id: "menstrual",
    name: "Menstrual phase",
    days: "Days 1–5",
    emoji: "🌑",
    color: "#e8637a",
    bg: "#fde8ec",
    what: "Your uterine lining sheds. Estrogen and progesterone are at their lowest. This marks Day 1 of your new cycle.",
    body: [
      "Uterus contracts to shed lining",
      "Prostaglandins cause cramping",
      "Iron levels may dip slightly",
      "Core body temperature drops",
    ],
    symptoms: ["Cramps", "Fatigue", "Lower back pain", "Bloating", "Headaches"],
    tips: [
      "Apply heat to lower abdomen for cramp relief",
      "Eat iron-rich foods: lentils, spinach, red meat",
      "Gentle yoga or walking reduces pain",
      "Prioritise 8+ hours of sleep",
      "Magnesium helps with cramps and mood",
    ],
    hormones: "Estrogen ↓  Progesterone ↓  FSH rising",
  },
  {
    id: "follicular",
    name: "Follicular phase",
    days: "Days 1–13",
    emoji: "🌒",
    color: "#f0a500",
    bg: "#fff5e0",
    what: "FSH tells your ovaries to mature follicles. As one follicle dominates, estrogen rises steadily — you'll feel it as increasing energy and optimism.",
    body: [
      "Follicle-stimulating hormone rises",
      "Estrogen climbs — uterine lining thickens",
      "Brain produces more serotonin",
      "Skin often looks clearer and glowing",
    ],
    symptoms: ["Increased energy", "Improved mood", "Better focus", "Higher libido starting"],
    tips: [
      "Start new projects and take on challenges",
      "Great week for strength training",
      "Social battery is high — plan events",
      "Eat probiotic-rich foods for gut health",
      "Your creativity peaks in late follicular",
    ],
    hormones: "Estrogen ↑↑  FSH ↑  LH low",
  },
  {
    id: "ovulation",
    name: "Ovulation phase",
    days: "Days 14–16",
    emoji: "🌕",
    color: "#3dba8a",
    bg: "#e8f8f2",
    what: "An LH surge triggers the release of a mature egg. This is your most fertile window — the egg survives 12–24 hours but sperm can survive up to 5 days.",
    body: [
      "LH surge triggers egg release",
      "Egg travels down the fallopian tube",
      "Cervical mucus becomes clear and stretchy",
      "Basal body temperature rises ~0.2°C after ovulation",
    ],
    symptoms: ["Mild pelvic pain (Mittelschmerz)", "Increased discharge", "Higher confidence", "Peak libido"],
    tips: [
      "If trying to conceive, this is your window",
      "Voice is naturally more attractive to others",
      "Schedule difficult conversations or negotiations",
      "Take photos — skin looks best now",
      "BBT tracking confirms ovulation after the fact",
    ],
    hormones: "LH ↑↑ (surge)  Estrogen peaks  Progesterone rising",
  },
  {
    id: "luteal",
    name: "Luteal phase",
    days: "Days 17–28",
    emoji: "🌘",
    color: "#7b6fd6",
    bg: "#ede9fb",
    what: "The empty follicle becomes the corpus luteum and secretes progesterone. If no fertilisation occurs, hormone levels fall, triggering the next period.",
    body: [
      "Corpus luteum secretes progesterone",
      "Body temperature remains elevated",
      "Uterine lining stays thick (waiting)",
      "If no egg implants, corpus luteum breaks down",
    ],
    symptoms: ["PMS symptoms", "Bloating", "Breast tenderness", "Mood swings", "Cravings", "Fatigue"],
    tips: [
      "Reduce caffeine and alcohol — they amplify PMS",
      "Complex carbs stabilise blood sugar and mood",
      "Light exercise like yoga, swimming, walking",
      "Journal to process emotions",
      "Magnesium and vitamin B6 reduce PMS severity",
      "Sleep needs increase — honour that",
    ],
    hormones: "Progesterone ↑↑  Estrogen moderate  LH ↓",
  },
];

const FAQ = [
  {
    q: "What is a 'normal' cycle length?",
    a: "Anywhere from 21 to 35 days is considered normal. The average is 28 days, but most people vary from that. What matters more is your personal consistency.",
  },
  {
    q: "Why does my cycle change every month?",
    a: "Stress, sleep, illness, diet, travel, and exercise all affect your hormones and can shift your cycle by a few days. Occasional variation is completely normal.",
  },
  {
    q: "What is PMS vs PMDD?",
    a: "PMS (Premenstrual Syndrome) affects 75% of people. PMDD (Premenstrual Dysphoric Disorder) is a severe form affecting 3–8% of people, with significant mood disruption. PMDD warrants medical support.",
  },
  {
    q: "Can I get pregnant during my period?",
    a: "Unlikely, but possible — especially with shorter cycles. Sperm can survive up to 5 days, so if you ovulate early, overlap is theoretically possible.",
  },
  {
    q: "What is spotting?",
    a: "Light bleeding or brown discharge outside your period. Can be caused by ovulation, implantation, hormonal changes, or starting birth control. Persistent spotting should be checked by a doctor.",
  },
];

export default function Education() {
  const [activePhase, setActivePhase] = useState("menstrual");
  const [openFaq, setOpenFaq] = useState(null);

  const phase = PHASES.find((p) => p.id === activePhase);

  return (
    <div className="page">
      <h1 className="page-title">Learn</h1>
      <p className="page-sub">Understand your cycle phases and body</p>

      {/* Phase selector */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginBottom: 24,
        }}
      >
        {PHASES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePhase(p.id)}
            style={{
              padding: "12px 8px",
              borderRadius: "var(--radius-sm)",
              border: "1.5px solid",
              borderColor: activePhase === p.id ? p.color : "var(--border)",
              background: activePhase === p.id ? p.bg : "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{p.emoji}</div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: activePhase === p.id ? p.color : "var(--text-muted)",
              }}
            >
              {p.id.charAt(0).toUpperCase() + p.id.slice(1)}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{p.days}</div>
          </button>
        ))}
      </div>

      {/* Phase detail */}
      {phase && (
        <div className="card" style={{ marginBottom: 24, borderTop: `3px solid ${phase.color}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: "2rem" }}>{phase.emoji}</span>
            <div>
              <h2 style={{ fontSize: "1.2rem", color: "var(--plum)" }}>{phase.name}</h2>
              <div
                style={{
                  display: "inline-block",
                  padding: "2px 10px",
                  borderRadius: 50,
                  fontSize: "0.75rem",
                  background: phase.bg,
                  color: phase.color,
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                {phase.days}
              </div>
            </div>
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: 20, lineHeight: 1.7 }}>
            {phase.what}
          </p>

          {/* Hormones */}
          <div
            style={{
              background: phase.bg,
              borderRadius: "var(--radius-sm)",
              padding: "10px 14px",
              marginBottom: 20,
              fontSize: "0.85rem",
              color: phase.color,
              fontWeight: 500,
            }}
          >
            🧬 {phase.hormones}
          </div>

          <div className="grid-2">
            {/* What's happening */}
            <div>
              <h3 style={{ fontSize: "0.95rem", color: "var(--plum)", marginBottom: 10 }}>
                What's happening in your body
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {phase.body.map((b) => (
                  <li key={b} style={{ display: "flex", gap: 8, fontSize: "0.88rem", color: "var(--text-muted)" }}>
                    <span style={{ color: phase.color }}>→</span> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Self-care tips */}
            <div>
              <h3 style={{ fontSize: "0.95rem", color: "var(--plum)", marginBottom: 10 }}>
                Self-care tips
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {phase.tips.map((t) => (
                  <li key={t} style={{ display: "flex", gap: 8, fontSize: "0.88rem", color: "var(--text-muted)" }}>
                    <span style={{ color: phase.color }}>✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Common symptoms */}
          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: "0.95rem", color: "var(--plum)", marginBottom: 10 }}>
              Common symptoms
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {phase.symptoms.map((s) => (
                <span
                  key={s}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 50,
                    fontSize: "0.82rem",
                    background: phase.bg,
                    color: phase.color,
                    fontWeight: 500,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      <h2 style={{ fontSize: "1.15rem", color: "var(--plum)", marginBottom: 14 }}>
        Common questions
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQ.map((item, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px 18px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--plum)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {item.q}
              <span style={{ color: "var(--rose)", fontSize: "1.1rem" }}>
                {openFaq === i ? "−" : "+"}
              </span>
            </button>
            {openFaq === i && (
              <div
                style={{
                  padding: "0 18px 14px",
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  borderTop: "1px solid var(--border)",
                  paddingTop: 12,
                }}
              >
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div
        style={{
          marginTop: 32,
          padding: "12px 16px",
          background: "var(--blush)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        ⚕️ This content is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider for personal health concerns.
      </div>
    </div>
  );
}