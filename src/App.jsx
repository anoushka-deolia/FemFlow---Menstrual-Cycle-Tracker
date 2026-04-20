import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LogsProvider } from "./context/LogsContext";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

const Login      = lazy(() => import("./pages/Login"));
const Dashboard  = lazy(() => import("./pages/Dashboard"));
const Calendar   = lazy(() => import("./pages/Calendar"));
const History    = lazy(() => import("./pages/History"));
const Insights   = lazy(() => import("./pages/Insights"));
const Trends     = lazy(() => import("./pages/Trends"));
const Education  = lazy(() => import("./pages/Education"));
const Assistant = lazy(() => import("./pages/Assistant"));

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const Loader = () => (
  <div className="page-loader">
    <div className="loader-dot" />
    <div className="loader-dot" />
    <div className="loader-dot" />
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          <Route path="/trends" element={<ProtectedRoute><Trends /></ProtectedRoute>} />
          <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LogsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LogsProvider>
    </AuthProvider>
  );
}