import { useState, useRef, useEffect } from "react";
import { useLogs } from "../hooks/useLogs";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;
// gemini-2.5-flash on v1beta = current free tier model (2.0-flash was retired Mar 2026)
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const SUGGESTED = [
  "Why do I get cramps during my period?",
  "What foods help with PMS?",
  "How can I track my ovulation naturally?",
  "Why am I so tired in my luteal phase?",
  "What does my symptom history suggest?",
];

function buildSystemPrompt({ currentPhase, currentCycleDay, avgCycleLength, nextPeriod, symptomStats }) {
  const topSymptoms = symptomStats
    .slice(0, 5)
    .map((s) => `${s.name} (${s.count}x)`)
    .join(", ");
  const nextStr = nextPeriod
    ? nextPeriod.toLocaleDateString("en-IN", { day: "numeric", month: "long" })
    : "unknown";
  return `You are FemFlow Assistant — a warm, knowledgeable, and empathetic menstrual health companion.

User's current cycle data:
- Current phase: ${currentPhase}
- Cycle day: ${currentCycleDay ?? "unknown"}
- Average cycle length: ${avgCycleLength} days
- Next predicted period: ${nextStr}
- Most frequent symptoms: ${topSymptoms || "none yet"}

Guidelines:
1. Be warm, supportive, and non-judgmental.
2. Give personalised advice using the cycle data above where relevant.
3. For medical concerns, always recommend consulting a doctor.
4. Keep responses concise — use short paragraphs.
5. Use conversational tone, not clinical language.
6. Never diagnose conditions — only provide education and general guidance.`;
}

export default function Assistant() {
  const cycleData = useLogs();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setError("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(cycleData);

      // Build Gemini conversation format
      const geminiContents = newMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Gemini API error");
      }

      const data = await response.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I could not generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
     setError(`Error: ${err.message}`);
      setMessages(newMessages.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="page"
      style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 40px)" }}
    >
      <div style={{ marginBottom: 16, flexShrink: 0 }}>
        <h1 className="page-title">AI Assistant ✨</h1>
        <p className="page-sub">Ask anything about your cycle — personalised to your data</p>
      </div>

      {!API_KEY && (
        <div style={{ background: "#fff5e0", border: "1px solid #f0c060", borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: 16, fontSize: "0.85rem", color: "#8a5c00", flexShrink: 0 }}>
          ⚠️ Add <code style={{ background: "#ffe8a0", padding: "1px 5px", borderRadius: 4 }}>VITE_GEMINI_KEY=AIzaSy...</code> to your .env file and restart the dev server.
        </div>
      )}

      {messages.length === 0 && (
        <div style={{ marginBottom: 20, flexShrink: 0 }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 10 }}>Try asking:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SUGGESTED.map((s) => (
              <button key={s} className="btn btn-ghost" style={{ fontSize: "0.82rem", padding: "6px 14px" }} onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8, minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--rose-pale)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0, marginRight: 8, marginTop: 2 }}>
                🌺
              </div>
            )}
            <div style={{
              maxWidth: "75%",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? "var(--rose)" : "#fff",
              color: msg.role === "user" ? "#fff" : "var(--text)",
              fontSize: "0.92rem",
              lineHeight: 1.65,
              border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
              boxShadow: msg.role === "assistant" ? "var(--shadow)" : "none",
              whiteSpace: "pre-wrap",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--rose-pale)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>🌺</div>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "18px 18px 18px 4px", padding: "12px 18px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rose-light)", animation: "bounce 0.9s infinite ease-in-out", animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: "#fdf0f0", border: "1px solid #f0c0c0", borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: "0.85rem", color: "#c0392b" }}>
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10, paddingTop: 12, borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your cycle, symptoms, health…"
          rows={1}
          style={{ flex: 1, resize: "none", borderRadius: 50, padding: "10px 18px", fontSize: "0.92rem", lineHeight: 1.5, maxHeight: 120, overflow: "auto" }}
        />
        <button
          className="btn btn-primary"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{ borderRadius: "50%", width: 44, height: 44, padding: 0, flexShrink: 0 }}
        >
          ↑
        </button>
      </div>

      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", marginTop: 8, flexShrink: 0 }}>
        Powered by Gemini 2.5 Flash · Educational purposes only · Not medical advice
      </p>
    </div>
  );
}