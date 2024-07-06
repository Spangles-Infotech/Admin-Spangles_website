import React from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

function Container() {
  return (
    <React.Fragment>
      <Navbar />
      <section className="w-full h-full flex">
        <Sidebar />
        <div className="w-full min-h-full p-4 sm:ml-64 lg:ml-80 mt-20">
          <Outlet />
        </div>
      </section>
    </React.Fragment>
  );
}

export default Container;
