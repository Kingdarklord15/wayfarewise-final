import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isAuthed, logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-night/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 w-[min(1180px,calc(100%-32px))] items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-black">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-aqua text-night">AI</span>
          <span>Travel Planner</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-bold text-white/70 md:flex">
          <NavLink className={({ isActive }) => (isActive ? "text-aqua" : "hover:text-white")} to="/planner">
            Planner
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? "text-aqua" : "hover:text-white")} to="/dashboard">
            Dashboard
          </NavLink>
        </div>
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <>
              <span className="hidden text-sm text-white/60 sm:block">{user?.name}</span>
              <button onClick={handleLogout} className="btn-secondary px-4 py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="hidden font-bold text-white/70 hover:text-white sm:block" to="/login">
                Login
              </Link>
              <Link className="rounded-lg bg-aqua px-4 py-2 font-extrabold text-night" to="/signup">
                Start Free
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
