import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login/Login.tsx";
import AttendanceDetails from "./components/AttendanceDetails/AttendanceDetails.tsx";
import AttendancePage from "./components/AttendancePage/AttendancePage.tsx";
import Register from "./components/Register/Register.tsx";
import UserDetails from "./components/UserDetails/UserDetails.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import Layout from "./components/Layout/Layout.tsx";

export default function App() {
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  const isAdminLoggedIn = JSON.parse(localStorage.getItem("isAdminLoggedIn"));
  return (
    <div>
      <Layout>
        <Routes>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* <ProtectedRoute> */}

          {(isLoggedIn || isAdminLoggedIn) && (
            <>
              <Route path="AttendanceDetails" element={<AttendanceDetails />} />
              <Route path="AttendancePage" element={<AttendancePage />} />
              <Route path="UserDetails" element={<UserDetails />} />
            </>
          )}

          {isAdminLoggedIn && (
            <Layout>
              <Route path="UserDetails" element={<UserDetails />} />
            </Layout>
          )}
          {/* </ProtectedRoute> */}

          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Layout>
    </div>
  );
}

function NoMatch() {
  return (
    <div className="h-[100vh] w-full flex justify-center items-center flex-col">
      <h2 className="font-semibold text-xl">Page Not Found!</h2>
      <p className="text-blue-600 font-semibold text-xl">
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
