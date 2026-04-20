import { useState } from "react";
import { useLogs } from "../hooks/useLogs";

const FLOW_EMOJI = { light: "🩸", medium: "🩸🩸", heavy: "🩸🩸🩸", spotting: "•" };

export default function LogItem({ log }) {
  const { removeLog } = useLogs();
  const [confirm, setConfirm] = useState(false);

  const dateStr = log.date
    ? new Date(
        log.date?.toDate ? log.date.toDate() : log.date
      ).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      {/* Left */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 600,
            color: "var(--plum)",
            marginBottom: 4,
            fontSize: "0.95rem",
          }}
        >
          {dateStr}
        </div>

        {log.flow && log.flow !== "none" && (
          <span
            style={{
              fontSize: "0.8rem",
              background: "var(--rose-pale)",
              color: "var(--rose)",
              padding: "2px 10px",
              borderRadius: 50,
              marginRight: 6,
              display: "inline-block",
              marginBottom: 6,
            }}
          >
            {FLOW_EMOJI[log.flow] || "🩸"} {log.flow}
          </span>
        )}

        {log.mood && (
          <span
            style={{
              fontSize: "0.8rem",
              background: "#ede9fb",
              color: "var(--luteal)",
              padding: "2px 10px",
              borderRadius: 50,
              marginRight: 6,
              display: "inline-block",
              marginBottom: 6,
            }}
          >
            {log.mood}
          </span>
        )}

        {log.symptoms?.length > 0 && (
          <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
            {log.symptoms.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: "0.78rem",
                  background: "var(--blush)",
                  color: "var(--text-muted)",
                  padding: "2px 8px",
                  borderRadius: 50,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {log.notes && (
          <p
            style={{
              marginTop: 8,
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            "{log.notes}"
          </p>
        )}
      </div>

      {/* Delete */}
      <div>
        {confirm ? (
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className="btn btn-danger"
              style={{ padding: "4px 12px", fontSize: "0.8rem" }}
              onClick={() => removeLog(log.id)}
            >
              Yes
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: "4px 12px", fontSize: "0.8rem" }}
              onClick={() => setConfirm(false)}
            >
              No
            </button>
          </div>
        ) : (
          <button
            className="btn btn-ghost"
            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
            onClick={() => setConfirm(true)}
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
}