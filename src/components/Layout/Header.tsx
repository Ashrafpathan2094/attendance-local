import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLoggedIn = JSON.parse(localStorage.getItem("isAdminLoggedIn"));
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (user) => user.email === localStorage.getItem("currentLoggedIn")
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentLoggedIn");
    localStorage.removeItem("isSignedIn");
    localStorage.removeItem("isAdminLoggedIn");
    setDropdownOpen(false);
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-gray-100 w-full flex justify-center items-center shadow-md">
      <div className="flex justify-between items-center w-[95%] mt-4 bg-blue-500 p-4 rounded-lg relative">
        <div className="text-white font-semibold text-lg">
          Hello,{" "}
          <span className="text-yellow-300">
            {isAdminLoggedIn ? "Admin" : user?.username}
          </span>
          !
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            <>
              <Link
                to="/attendancePage"
                className={`${
                  isActive("/attendancePage") ? "bg-blue-700" : ""
                } text-white hover:text-gray-300 transition duration-200 px-3 py-2 rounded-md hover:bg-blue-700`}
              >
                Attendance Page
              </Link>
              <Link
                to="/attendanceDetails"
                className={`${
                  isActive("/attendanceDetails") ? "bg-blue-700" : ""
                } text-white hover:text-gray-300 transition duration-200 px-3 py-2 rounded-md hover:bg-blue-700`}
              >
                Attendance Details
              </Link>
            </>
          )}
          {(isLoggedIn || isAdminLoggedIn) && (
            <Link
              to="/attendanceRequests"
              className={`${
                isActive("/attendanceRequests") ? "bg-blue-700" : ""
              } text-white hover:text-gray-300 transition duration-200 px-3 py-2 rounded-md hover:bg-blue-700`}
            >
              Attendance Requests
            </Link>
          )}
          {isAdminLoggedIn && (
            <Link
              to="/UserDetails"
              className={`${
                isActive("/UserDetails") ? "bg-blue-700" : ""
              } text-white hover:text-gray-300 transition duration-200 px-3 py-2 rounded-md hover:bg-blue-700`}
            >
              UserDetails
            </Link>
          )}

          <div className="relative">
            <img
              src="/user.png"
              alt="user-icon"
              className="h-8 w-8 p-1 cursor-pointer rounded-full border border-white hover:border-yellow-300"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100 transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
