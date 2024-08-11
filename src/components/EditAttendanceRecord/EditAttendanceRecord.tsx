import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditAttendanceRecord = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [signInTime, setSignInTime] = useState("");
  const [signOutTime, setSignOutTime] = useState("");
  const [day, setDay] = useState("");
  const [originalSignInTime, setOriginalSignInTime] = useState("");
  const [originalSignOutTime, setOriginalSignOutTime] = useState("");
  const [originalDay, setOriginalDay] = useState("");
  const [error, setError] = useState("");

  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };

  useEffect(() => {
    const queryParams = getQueryParams();
    const email = queryParams.get("email");
    const day = queryParams.get("day") || "";
    const signInTime = queryParams.get("signInTime") || "";
    const signOutTime = queryParams.get("signOutTime") || "";
    setDay(day);
    setSignInTime(signInTime);
    setSignOutTime(signOutTime);
    setOriginalSignInTime(signInTime);
    setOriginalSignOutTime(signOutTime);
    setOriginalDay(day);
  }, [location.search]);

  const handleSave = () => {
    if (signOutTime <= signInTime) {
      setError("Sign-out time must be greater than sign-in time.");
      return;
    }

    const queryParams = getQueryParams();
    const email = queryParams.get("email");

    const editRequest = {
      email,
      day: originalDay,
      signInTime: originalSignInTime,
      signOutTime: originalSignOutTime,
      requestedSignInTime: signInTime,
      requestedSignOutTime: signOutTime,
      requestedDay: day,
      status: "Pending",
    };

    const editRequests =
      JSON.parse(localStorage.getItem("attendanceEditRequests")) || [];
    editRequests.push(editRequest);
    localStorage.setItem(
      "attendanceEditRequests",
      JSON.stringify(editRequests)
    );
    alert("Created a request for this record.");
    navigate("/attendanceDetails");
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Edit Attendance Record
      </h2>
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="day">
            Date
          </label>
          <input
            className="w-full p-2 border rounded-md"
            type="date"
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            max={getCurrentDate()}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="signInTime">
            Sign In Time
          </label>
          <input
            className="w-full p-2 border rounded-md"
            type="time"
            step="1"
            id="signInTime"
            value={signInTime}
            onChange={(e) => setSignInTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="signOutTime">
            Sign Out Time
          </label>
          <input
            className="w-full p-2 border rounded-md"
            type="time"
            step="1"
            id="signOutTime"
            value={signOutTime}
            onChange={(e) => setSignOutTime(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleSave}
        >
          Request Edit
        </button>
      </div>
    </div>
  );
};

export default EditAttendanceRecord;
