import React, { useEffect, useState } from "react";
import jobPost from "../assets/Group 263.png";
import blogs from "../assets/Group 265.png";
import gallery from "../assets/Group 1000001926.png";
import userAccess from "../assets/Group 1000001921.png";
import logout from "../assets/Group 56.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { initFlowbite } from "flowbite";
function Sidebar() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    initFlowbite();
  }, []);
  return (
    <React.Fragment>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 lg:w-80 h-screen pt-28 transition-transform -translate-x-full sm:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col justify-between px-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-6 font-medium">
            {user && (user.access_to.includes("Job Post") || user.isAdmin) && (
              <li>
                <Link
                  to="/admin/job-post/list"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    src={jobPost}
                    className="flex-shrink-0 w-7 h-7 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
                    alt="Job Post icon"
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Job Post
                  </span>
                </Link>
              </li>
            )}
            {user && (user.access_to.includes("Blogs") || user.isAdmin) && (
              <li>
                <Link
                  to="/admin/blogs/list"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    src={blogs}
                    className="flex-shrink-0 w-7 h-7 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
                    alt="Blogs icon"
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">Blogs</span>
                </Link>
              </li>
            )}
            {user && (user.access_to.includes("Gallery") || user.isAdmin) && (
              <li>
                <Link
                  to="/admin/gallery/list"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    src={gallery}
                    className="flex-shrink-0 w-7 h-7 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
                    alt="Gallery icon"
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">Gallery</span>
                </Link>
              </li>
            )}
            {user && user.isAdmin && (
              <li>
                <Link
                  to="/admin/user-access/list"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    src={userAccess}
                    className="flex-shrink-0 w-7 h-7 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
                    alt="User Access icon"
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    User Access
                  </span>
                </Link>
              </li>
            )}
          </ul>
          <div className="mb-10">
            <button
              type="button"
              data-modal-target="logout-modal"
              data-modal-toggle="logout-modal"
              className="w-full text-left flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <img
                src={logout}
                className="flex-shrink-0 w-7 h-7 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
                alt="Log Out icon"
              />
              <span className="flex-1 ms-3 whitespace-nowrap">Log Out</span>
            </button>
          </div>
        </div>
      </aside>
      <div
        id="logout-modal"
        data-modal-backdrop="static"
        tabIndex="-1"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="logout-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to Log Out?
              </h3>
              <button
                data-modal-hide="logout-modal"
                type="button"
                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-spangles-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.localStorage.clear();
                  navigate("/");
                }}
                data-modal-hide="logout-modal"
                type="button"
                className="text-white ms-5 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Sidebar;
