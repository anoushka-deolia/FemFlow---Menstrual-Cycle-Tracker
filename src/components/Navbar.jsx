import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const links = [
  { to: "/",          icon: "🌸", label: "Home" },
  { to: "/calendar",  icon: "📅", label: "Calendar" },
  { to: "/history",   icon: "📋", label: "History" },
  { to: "/insights",  icon: "💡", label: "Insights" },
  { to: "/trends",    icon: "📈", label: "Trends" },
  { to: "/education", icon: "📚", label: "Learn" },
  { to: "/assistant", icon: "✨", label: "AI" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🌺</span>
          <span className="brand-name">FemFlow</span>
        </div>

        <div className="sidebar-links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <span className="link-icon">{l.icon}</span>
              <span className="link-label">{l.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="user-chip">
            <div className="user-avatar">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="btn btn-ghost logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              "bottom-link" + (isActive ? " active" : "")
            }
          >
            <span>{l.icon}</span>
            <span className="bottom-label">{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}