import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import NotificationsBell from "../components/NotificationBell"; // <-- adjust path if needed
import "./StaffLayout.css";

function StaffLayout() {
  const navigate = useNavigate();
  const [allowInventory, setAllowInventory] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/api/inventory/settings"); // { staff_can_receive, ... }
        if (mounted) setAllowInventory(!!data?.staff_can_receive);
      } catch {
        // if it fails, just hide the link
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="bg-light p-3 border-end d-flex flex-column"
        style={{ width: "220px", minHeight: "100vh" }}
      >
        {/* Sticky header with bell on the right */}
        <div
          className="sticky-top bg-light pb-2 mb-3 border-bottom d-flex align-items-center justify-content-between"
          style={{ zIndex: 1 }}
        >
          <h5 className="m-0">Staff Menu</h5>
          <div className="ms-2">
            <NotificationsBell />
          </div>
        </div>

        {/* Nav list scrolls under the sticky header */}
        <ul className="nav flex-column overflow-auto" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <li className="nav-item">
            <NavLink
              to="/staff"
              end
              className={({ isActive }) => "nav-link" + (isActive ? " fw-bold text-primary" : "")}
            >
              🏠 Dashboard
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/staff/appointments"
              className={({ isActive }) => "nav-link" + (isActive ? " fw-bold text-primary" : "")}
            >
              📅 Appointments
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/staff/appointment-reminders"
              className={({ isActive }) => "nav-link" + (isActive ? " fw-bold text-primary" : "")}
            >
              🔔 Reminders
            </NavLink>
          </li>

          {/* Inventory appears only if admin enabled staff receiving */}
          {loaded && allowInventory && (
            <li className="nav-item">
              <NavLink
                to="/staff/inventory"
                className={({ isActive }) => "nav-link" + (isActive ? " fw-bold text-primary" : "")}
              >
                📦 Inventory
              </NavLink>
            </li>
          )}

          <li className="nav-item">
            <NavLink
              to="/staff/profile"
              className={({ isActive }) => "nav-link" + (isActive ? " fw-bold text-primary" : "")}
            >
              👤 Account
            </NavLink>
          </li>
        </ul>

        {/* Logout pinned to bottom */}
        <div className="mt-auto pt-3">
          <button onClick={handleLogout} className="btn btn-outline-danger w-100">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default StaffLayout;
