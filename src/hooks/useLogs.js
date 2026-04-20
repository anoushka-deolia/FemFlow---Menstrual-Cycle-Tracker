import { useMemo } from "react";
import { useLogs as useLogsCtx } from "../context/LogsContext";

// ── helpers ──────────────────────────────────────────────
const toDate = (val) => {
  if (!val) return null;
  if (val?.toDate) return val.toDate();
  if (typeof val === "string") return new Date(val);
  return new Date(val);
};

const daysBetween = (a, b) =>
  Math.round(Math.abs((new Date(a) - new Date(b)) / 86400000));

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

// ── main hook ────────────────────────────────────────────
export const useLogs = () => {
  const ctx = useLogsCtx();
  const { logs } = ctx;

  // All period-start logs sorted oldest first
  const periodStarts = useMemo(() => {
    return logs
      .filter((l) => l.flow && l.flow !== "none")
      .map((l) => ({ ...l, dateObj: toDate(l.date) }))
      .sort((a, b) => a.dateObj - b.dateObj);
  }, [logs]);

  // Average cycle length from last 6 cycles
  const avgCycleLength = useMemo(() => {
    if (periodStarts.length < 2) return 28;
    const gaps = [];
    for (let i = 1; i < Math.min(periodStarts.length, 7); i++) {
      gaps.push(daysBetween(periodStarts[i].dateObj, periodStarts[i - 1].dateObj));
    }
    return Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
  }, [periodStarts]);

  // Current cycle day
  const currentCycleDay = useMemo(() => {
    if (!periodStarts.length) return null;
    const last = periodStarts[periodStarts.length - 1].dateObj;
    return daysBetween(new Date(), last) + 1;
  }, [periodStarts]);

  // Phase based on cycle day
  const currentPhase = useMemo(() => {
    const day = currentCycleDay;
    if (!day) return "unknown";
    if (day <= 5) return "menstrual";
    if (day <= 13) return "follicular";
    if (day <= 16) return "ovulation";
    return "luteal";
  }, [currentCycleDay]);

  // Next period prediction
  const nextPeriod = useMemo(() => {
    if (!periodStarts.length) return null;
    const last = periodStarts[periodStarts.length - 1].dateObj;
    return addDays(last, avgCycleLength);
  }, [periodStarts, avgCycleLength]);

  // Ovulation window
  const ovulationWindow = useMemo(() => {
    if (!nextPeriod) return null;
    return {
      start: addDays(nextPeriod, -avgCycleLength + 11),
      end: addDays(nextPeriod, -avgCycleLength + 17),
    };
  }, [nextPeriod, avgCycleLength]);

  // Symptom frequency map
  const symptomStats = useMemo(() => {
    const map = {};
    logs.forEach((l) => {
      (l.symptoms || []).forEach((s) => {
        map[s] = (map[s] || 0) + 1;
      });
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [logs]);

  // Cycle length history for trend chart
  const cycleLengthHistory = useMemo(() => {
    if (periodStarts.length < 2) return [];
    const data = [];
    for (let i = 1; i < periodStarts.length; i++) {
      data.push({
        cycle: `Cycle ${i}`,
        length: daysBetween(periodStarts[i].dateObj, periodStarts[i - 1].dateObj),
      });
    }
    return data;
  }, [periodStarts]);

  return {
    ...ctx,
    avgCycleLength,
    currentCycleDay,
    currentPhase,
    nextPeriod,
    ovulationWindow,
    symptomStats,
    cycleLengthHistory,
  };
};