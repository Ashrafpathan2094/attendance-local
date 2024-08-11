import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AttendancePage = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [isSignedIn, setIsSignedIn] = useState(
    JSON.parse(localStorage.getItem("isSignedIn")) || false
  );
  const [lastSignedInTime, setLastSignedInTime] = useState(null);
  const currentLoggedIn = localStorage.getItem("currentLoggedIn");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSignIn = () => {
    const attendanceRecords =
      JSON.parse(localStorage.getItem("attendanceRecords")) || [];

    const newRecord = {
      email: currentLoggedIn,
      day: formatDate(dateTime),
      signInTime: formatTime(dateTime),
      signOutTime: null,
    };

    attendanceRecords.push(newRecord);
    localStorage.setItem(
      "attendanceRecords",
      JSON.stringify(attendanceRecords)
    );
    localStorage.setItem("isSignedIn", true);
    setLastSignedInTime(dateTime);
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    const attendanceRecords =
      JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    const updatedRecords = attendanceRecords.map((record) => {
      if (
        record.email === currentLoggedIn &&
        record.day === formatDate(dateTime) &&
        record.signOutTime === null
      ) {
        return {
          ...record,
          signOutTime: formatTime(dateTime),
        };
      }
      return record;
    });

    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));
    localStorage.setItem("isSignedIn", false);
    setLastSignedInTime(null);
    setIsSignedIn(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentLoggedIn");
    localStorage.removeItem("isSignedIn");
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/");
  };

  useEffect(() => {
    const attendanceRecords =
      JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    const isUserSignedIn = attendanceRecords.some(
      (record) =>
        record.email === currentLoggedIn &&
        record.day === formatDate(dateTime) &&
        record.signOutTime === null
    );

    setIsSignedIn(isUserSignedIn);
    if (isUserSignedIn) {
      const lastRecord = attendanceRecords.find(
        (record) =>
          record.email === currentLoggedIn &&
          record.day === formatDate(dateTime) &&
          record.signOutTime === null
      );
      setLastSignedInTime(
        new Date(`${formatDate(dateTime)}T${lastRecord.signInTime}`)
      );
    }
  }, [currentLoggedIn, dateTime]);

  return (
    <div className="flex flex-col items-center justify-start pt-10 h-screen bg-gray-100">
      <div className="flex justify-between items-center rounded-lg w-[90%] p-5 bg-white shadow-md">
        <div className="flex justify-start items-start flex-col">
          {isSignedIn && lastSignedInTime ? (
            <div>
              <div className="font-medium text-sm text-gray-600">
                Last Signed In:
              </div>
              <div className="font-semibold text-lg text-gray-800">
                {lastSignedInTime.toLocaleDateString()}{" "}
                {lastSignedInTime.toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="flex justify-start items-start flex-col">
              <div className="font-medium text-sm text-gray-600">
                Current Time:
              </div>
              <div className="font-semibold text-lg text-gray-800">
                {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>

        {isSignedIn ? (
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
          >
            Sign In
          </button>
        )}
      </div>
      <div
        className="flex justify-center items-center rounded-lg w-[20%] p-2 bg-blue-500 text-white mt-5 cursor-pointer hover:bg-blue-600 transition duration-200"
        onClick={() => navigate("/AttendanceDetails")}
      >
        View Attendance Report
      </div>
    </div>
  );
};

export default AttendancePage;
