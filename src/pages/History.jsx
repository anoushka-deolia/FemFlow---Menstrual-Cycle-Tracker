import { useMemo, useState } from "react";
import { useLogs } from "../hooks/useLogs";
import LogItem from "../components/LogItem";

export default function History() {
  const { logs, loading } = useLogs();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (l) =>
        l.notes?.toLowerCase().includes(q) ||
        l.flow?.toLowerCase().includes(q) ||
        l.mood?.toLowerCase().includes(q) ||
        l.symptoms?.some((s) => s.toLowerCase().includes(q))
    );
  }, [logs, search]);

  return (
    <div className="page">
      <h1 className="page-title">History</h1>
      <p className="page-sub">All your logged entries</p>

      <input
        className="input"
        type="search"
        placeholder="Search symptoms, moods, notes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20, maxWidth: 400 }}
      />

      {loading && (
        <div className="empty">
          <div className="loader-dot" style={{ margin: "0 auto" }} />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <p>{search ? "No entries match your search." : "No entries yet. Start logging on the dashboard!"}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((log) => (
          <LogItem key={log.id} log={log} />
        ))}
      </div>
    </div>
  );
}