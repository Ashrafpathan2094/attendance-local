import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const [users, setUsers] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usersData = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(usersData);
  }, []);

  const handleUserClick = (email) => {
    navigate(`/AttendanceDetails?email=${email}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentLoggedIn");
    localStorage.removeItem("isSignedIn");
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/");
  };
  return (
    <div className="flex flex-col items-center justify-start h-screen p-4">
      <div className="flex justify-between items-center my-2 w-full">
        <h2 className="text-2xl font-bold mb-6">User Details</h2>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Logout
        </button>
      </div>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
          {users.map((user, index) => (
            <li
              key={index}
              className="mb-2 cursor-pointer"
              onClick={() => handleUserClick(user.email)}
            >
              <p>Email: {user.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDetails;
