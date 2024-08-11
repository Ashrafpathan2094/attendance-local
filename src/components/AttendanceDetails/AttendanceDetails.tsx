import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AttendanceDetails = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [userAttendance, setUserAttendance] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };

  useEffect(() => {
    const queryParams = getQueryParams();
    const emailFromQuery = queryParams.get("email");
    const currentLoggedIn = localStorage.getItem("currentLoggedIn");
    const email = emailFromQuery || currentLoggedIn;
    if (email) {
      const records =
        JSON.parse(localStorage.getItem("attendanceRecords")) || [];
      const filteredRecords = records.filter(
        (record) => record.email === email
      );
      const groupedRecords = filteredRecords.reduce((acc, record) => {
        const { day } = record;
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(record);
        return acc;
      }, {});

      setUserAttendance(groupedRecords);
      setAttendanceRecords(filteredRecords);
    }
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentLoggedIn");
    localStorage.removeItem("isSignedIn");
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/");
  };

  const handleEdit = (email, day, signInTime, signOutTime) => {
    const attendanceEditRequests =
      JSON.parse(localStorage.getItem("attendanceEditRequests")) || [];
    const currentLoggedIn = localStorage.getItem("currentLoggedIn");

    const isPendingRequest = attendanceEditRequests.some(
      (request) =>
        request.email === currentLoggedIn &&
        request.day === day &&
        request.signInTime === signInTime &&
        // request.signOutTime === signOutTime &&
        request.status === "Pending"
    );

    if (isPendingRequest) {
      alert("Already a pending request for this record.");
    } else {
      navigate(
        `/editAttendanceRecord?email=${email}&day=${day}&signInTime=${signInTime}&signOutTime=${signOutTime}`
      );
    }
  };

  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");

  return (
    <div className="flex flex-col items-center justify-start h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center w-full mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Attendance Details</h2>
      </div>
      {Object.keys(userAttendance).length === 0 ? (
        <p className="text-gray-600">No attendance records found.</p>
      ) : (
        Object.keys(userAttendance).map((day) => (
          <details key={day} className="w-full mb-4">
            <summary className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 transition duration-200">
              {day}
            </summary>
            <div className="bg-white p-4 rounded-md shadow-md mt-2">
              {userAttendance[day].map((record, index) => (
                <div
                  key={index}
                  className="mb-2 border-b border-gray-200 pb-2 last:border-none"
                >
                  <div className="flex justify-between">
                    <p className="text-gray-700">
                      <span className="font-medium">Sign In:</span>{" "}
                      {record.signInTime}
                    </p>
                    {record.signOutTime && (
                      <p className="text-gray-700">
                        <span className="font-medium">Sign Out:</span>{" "}
                        {record.signOutTime}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm mt-1">
                    <p>Date: {record.day}</p>
                    <p>Status: Full Day</p>
                  </div>
                  {!isAdminLoggedIn && (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                      onClick={() =>
                        handleEdit(
                          record.email,
                          record.day,
                          record.signInTime,
                          record.signOutTime
                        )
                      }
                    >
                      Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
          </details>
        ))
      )}
    </div>
  );
};

export default AttendanceDetails;
