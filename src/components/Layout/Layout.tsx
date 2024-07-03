import React from "react";
import Header from "./Header.tsx";
const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      <div className="navigationWrapper">
        <main>{children}</main>
      </div>
    </React.Fragment>
  );
};
export default Layout;
