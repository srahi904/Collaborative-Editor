/** @format */

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md flex justify-between items-center px-6 py-3 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard"
          className="font-bold text-xl text-indigo-600 hover:text-indigo-700"
        >
          Collaborative Editor
        </Link>
        {user && (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-indigo-600"
            >
              Dashboard
            </Link>
            <Link
              to="/editor/sample-room"
              className="text-gray-700 hover:text-indigo-600"
            >
              Sample Room
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">
              Hello, <strong>{user.username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600 px-3 py-1 border border-indigo-600 rounded-md"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
