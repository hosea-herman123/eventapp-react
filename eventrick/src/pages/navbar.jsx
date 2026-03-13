import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [rawUser, setRawUser] = useState(null);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const safeParse = (v) => {
    if (!v) return null;
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  };

  const normalize = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    const token = obj.accessToken || obj.token || obj.access_token || null;
    const role = obj.role || (obj.user && obj.user.role) || "customer";
    const name =
      obj.name || obj.user?.name || obj.user?.fullName || obj.fullName || null;
    const email = obj.email || obj.user?.email || null;
    return { name, email, role, token };
  };

  useEffect(() => {
    const load = () => {
      const raw = safeParse(localStorage.getItem("user"));
      setRawUser(raw);
      setUser(normalize(raw));
    };
    load();

    const onStorage = (e) => e.key === "user" && load();
    const onUserChanged = () => load();

    window.addEventListener("storage", onStorage);
    window.addEventListener("user-changed", onUserChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user-changed", onUserChanged);
    };
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [dropdownOpen]);

  const isAuthenticated = Boolean(user?.token || user?.role);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-changed"));
    setDropdownOpen(false);
    navigate("/login");
  };

  const avatarInitial = user?.name
    ? String(user.name).charAt(0).toUpperCase()
    : user?.role
    ? String(user.role).charAt(0).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-900 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight hover:text-purple-900">
            Eventrick
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-white text-lg font-medium">
          <Link to="/events" className="hover:text-purple-900">
            Events
          </Link>
          <Link to="/MyTickets" className="hover:text-purple-900">
            My Tickets
          </Link>
          {(user?.role === "admin" || user?.role === "employee") && (
            <>
              <Link to="/manageEvents" className="hover:text-purple-900">
                Manage Events
              </Link>
              <Link to="/report" className="hover:text-purple-900">
                Reports
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <Link to="/AdminPanel" className="hover:text-purple-900">
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="text-white text-lg hover:text-purple-950"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-purple-900 text-white text-lg px-3 py-1 rounded-md hover:bg-purple-950"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((s) => !s)}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-purple-900 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-purple-900 text-white flex items-center justify-center text-sm font-semibold">
                  {avatarInitial}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-medium text-white">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {user?.email || user?.role}
                  </span>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
                  <div className="px-4 py-3 border-b">
                    <div className="text-sm font-semibold">
                      {user?.name || "User"}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                    <div className="text-xs text-gray-500">
                      Role: {user?.role || "N/A"}
                    </div>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/CustomerProfile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                    </li>
                  </ul>
                  <div className="px-4 py-2 border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-sm text-red-600 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-purple-900 text-white"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <nav className="flex flex-col px-4 py-2 gap-2 text-white">
            <Link
              to="/events"
              className="py-2 px-2 rounded hover:bg-purple-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/MyTickets"
              className="py-2 px-2 rounded hover:bg-purple-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Tickets
            </Link>
            {(user?.role === "admin" || user?.role === "employee") && (
              <>
                <Link
                  to="/manageEvents"
                  className="py-2 px-2 rounded hover:bg-purple-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Manage Events
                </Link>
                <Link
                  to="/report"
                  className="py-2 px-2 rounded hover:bg-purple-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Reports
                </Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link
                to="/AdminPanel"
                className="py-2 px-2 rounded hover:bg-purple-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;