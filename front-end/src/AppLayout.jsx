import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Navbar.css";

const AppLayout = ({ children, myPlaytests, hideNav }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="container">
      {!hideNav && <Navbar onBurgerClick={() => setSidebarOpen(!sidebarOpen)} />}

      <div className="layout">

        <Sidebar
          myPlaytests={myPlaytests}
          isOpen={sidebarOpen}
          close={() => setSidebarOpen(false)}
        />

        <main className="main">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AppLayout;