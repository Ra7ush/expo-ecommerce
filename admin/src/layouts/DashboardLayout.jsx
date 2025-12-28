import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    <div className="drawer lg:drawer-open">
      <input
        type="checkbox"
        id="my-drawer"
        className="drawer-toggle"
        defaultChecked
      />
      <div className="drawer-content flex flex-col">
        <Navbar />

        <main className="p-4 flex-1 bg-base-100">
          <Outlet />
        </main>
      </div>
      <Sidebar />
    </div>
  );
}

export default DashboardLayout;
