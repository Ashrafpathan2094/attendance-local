import React, { ChangeEvent, useEffect, useState } from "react";

interface AttendanceRequest {
  day: string;
  email: string;
  requestedDay: string;
  requestedSignInTime: string;
  requestedSignOutTime: string;
  signInTime: string;
  signOutTime: string;
  status: string;
}

const AttendanceRequests: React.FC = () => {
  const [requests, setRequests] = useState<AttendanceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<AttendanceRequest[]>(
    []
  );
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const currentLoggedIn = localStorage.getItem("currentLoggedIn");
  const isAdminLoggedIn = JSON.parse(
    localStorage.getItem("isAdminLoggedIn") || "false"
  );

  useEffect(() => {
    const allRequests: AttendanceRequest[] = JSON.parse(
      localStorage.getItem("attendanceEditRequests") || "[]"
    );
    if (isAdminLoggedIn) {
      setRequests(allRequests);
      setFilteredRequests(allRequests);
    } else {
      const userRequests = allRequests.filter(
        (request) => request.email === currentLoggedIn
      );
      setRequests(userRequests);
      setFilteredRequests(userRequests);
    }
  }, [currentLoggedIn, isAdminLoggedIn]);

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
    if (selectedStatus === "All") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(
        requests.filter((request) => request.status === selectedStatus)
      );
    }
  };

  const updateRequestStatus = (
    email: string,
    day: string,
    signInTime: string,
    signOutTime: string,
    requestedDay: string,
    requestedSignInTime: string,
    requestedSignOutTime: string,
    status: string
  ) => {
    const updatedRequests = requests.map((request) => {
      if (
        request.email === email &&
        request.day === day &&
        request.signInTime === signInTime &&
        request.signOutTime === signOutTime
      ) {
        return { ...request, status };
      }
      return request;
    });

    setRequests(updatedRequests);
    setFilteredRequests(
      updatedRequests.filter((request) =>
        statusFilter === "All" ? true : request.status === statusFilter
      )
    );

    localStorage.setItem(
      "attendanceEditRequests",
      JSON.stringify(updatedRequests)
    );

    if (status === "Approved") {
      const allRecords = JSON.parse(
        localStorage.getItem("attendanceRecords") || "[]"
      );
      const updatedRecords = allRecords.map((record) => {
        if (
          record.email === email &&
          record.day === day &&
          record.signInTime === signInTime &&
          record.signOutTime === signOutTime
        ) {
          return {
            ...record,
            day: requestedDay,
            signInTime: requestedSignInTime,
            signOutTime: requestedSignOutTime,
          };
        }
        return record;
      });
      localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-3xl font-bold text-gray-800">
          Attendance Requests
        </h2>
      </div>
      <div className="w-full mb-4 flex justify-end items-center">
        <div className="w-[20%]">
          <label className="block text-gray-700 mb-2" htmlFor="statusFilter">
            Filter by Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Denied">Denied</option>
          </select>
        </div>
      </div>
      {filteredRequests.length === 0 ? (
        <p className="text-gray-600">No attendance requests found.</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {isAdminLoggedIn && (
                  <th className="py-2 px-4 border-b">Email</th>
                )}
                <th className="py-2 px-4 border-b">Day</th>
                <th className="py-2 px-4 border-b">Requested Day</th>
                <th className="py-2 px-4 border-b">Sign In Time</th>
                <th className="py-2 px-4 border-b">Requested Sign In Time</th>
                <th className="py-2 px-4 border-b">Sign Out Time</th>
                <th className="py-2 px-4 border-b">Requested Sign Out Time</th>
                <th className="py-2 px-4 border-b">
                  {isAdminLoggedIn ? "Actions" : "Status"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  {isAdminLoggedIn && (
                    <td className="py-2 px-4 border-b">{request.email}</td>
                  )}
                  <td className="py-2 px-4 border-b">{request.day}</td>
                  <td className="py-2 px-4 border-b">{request.requestedDay}</td>
                  <td className="py-2 px-4 border-b">{request.signInTime}</td>
                  <td className="py-2 px-4 border-b">
                    {request.requestedSignInTime}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {request.signOutTime === "null"
                      ? "No Sign out"
                      : request.signOutTime}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {request.requestedSignOutTime}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {isAdminLoggedIn && request.status === "Pending" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            updateRequestStatus(
                              request.email,
                              request.day,
                              request.signInTime,
                              request.signOutTime,
                              request.requestedDay,
                              request.requestedSignInTime,
                              request.requestedSignOutTime,
                              "Approved"
                            )
                          }
                          className="bg-green-500 text-white px-4 py rounded-md hover:bg-green-600 transition duration-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            updateRequestStatus(
                              request.email,
                              request.day,
                              request.signInTime,
                              request.signOutTime,
                              request.requestedDay,
                              request.requestedSignInTime,
                              request.requestedSignOutTime,
                              "Denied"
                            )
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                        >
                          Deny
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          request.status === "Approved"
                            ? "bg-green-500"
                            : request.status === "Denied"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {request.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceRequests;
