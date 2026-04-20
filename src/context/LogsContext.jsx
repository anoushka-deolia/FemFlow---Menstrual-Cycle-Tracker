import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getLogs, addLog, updateLog, deleteLog } from "../services/firebase";
import { useAuth } from "./AuthContext";

const LogsContext = createContext(null);

export const LogsProvider = ({ children }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getLogs(user.uid);
      setLogs(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const createLog = async (logData) => {
    if (!user) return;
    await addLog(user.uid, logData);
    fetchLogs();
  };

  const editLog = async (logId, data) => {
    if (!user) return;
    await updateLog(user.uid, logId, data);
    fetchLogs();
  };

  const removeLog = async (logId) => {
    if (!user) return;
    await deleteLog(user.uid, logId);
    fetchLogs();
  };

  return (
    <LogsContext.Provider value={{ logs, loading, createLog, editLog, removeLog, fetchLogs }}>
      {children}
    </LogsContext.Provider>
  );
};

export const useLogs = () => useContext(LogsContext);