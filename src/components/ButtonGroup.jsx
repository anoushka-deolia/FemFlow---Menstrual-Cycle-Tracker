export default function ButtonGroup({ options, value, onChange, multi = false }) {
  const toggle = (opt) => {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt]);
    } else {
      onChange(value === opt ? "" : opt);
    }
  };

  const isActive = (opt) =>
    multi ? (Array.isArray(value) && value.includes(opt)) : value === opt;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((opt) => (
        <button
          key={opt.value || opt}
          type="button"
          onClick={() => toggle(opt.value || opt)}
          style={{
            padding: "6px 16px",
            borderRadius: "50px",
            border: "1.5px solid",
            borderColor: isActive(opt.value || opt) ? "var(--rose)" : "var(--border)",
            background: isActive(opt.value || opt) ? "var(--rose-pale)" : "#fff",
            color: isActive(opt.value || opt) ? "var(--rose)" : "var(--text-muted)",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s",
            fontFamily: "inherit",
          }}
        >
          {opt.label || opt}
        </button>
      ))}
    </div>
  );
}