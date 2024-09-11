import React, { useEffect } from "react";
import jobPost from "../assets/Group 263.png";
import blogs from "../assets/Group 265.png";
import gallery from "../assets/Group 1000001926.png";
import userAccess from "../assets/Group 1000001921.png";
import ApplicantsIcon from "../assets/Group 1000002024.png";
import EnquiriesIcon from "../assets/Group 1000002049.png";
import logout from "../assets/Group 56.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { initFlowbite } from "flowbite";

function Sidebar() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();  // Get the current route

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    initFlowbite();
  }, []);

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;
 const handelLogOut= () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <React.Fragment>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 lg:w-80 pt-28 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="flex flex-col justify-between h-full px-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-6 font-medium">
            {user && (user.access_to.includes("Job Post") || user.isAdmin) && (
              <li>
                <Link
                  to="/admin/job-post/list"
                  className={`flex items-center p-2 rounded-lg group ${
                    isActive("/admin/job-post/list")
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={jobPost}
                    className="flex-shrink-0 w-7 h-7"
                    alt="Job Post icon"
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">Job Post</span>
                </Link>
              </li>
            )}
            {user && (user.access_to.includes("Blogs") || user.isAdmin) && (
              <li>
                <Link
                  to="/admin/blogs/list"
                  className={`flex items-center p-2 rounded-lg group ${
                    isActive("/admin/blogs/list")
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={blogs}
                    className="flex-shrink-0 w-7 h-7"
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
                  className={`flex items-center p-2 rounded-lg group ${
                    isActive("/admin/gallery/list")
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={gallery}
                    className="flex-shrink-0 w-7 h-7"
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
                  className={`flex items-center p-2 rounded-lg group ${
                    isActive("/admin/user-access/list")
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={userAccess}
                    className="flex-shrink-0 w-7 h-7"
                    alt="User Access icon"
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    User Access
                  </span>
                </Link>
              </li>
            )}
            {user &&
              (user.access_to.includes("Applicants") || user.isAdmin) && (
                <li>
                  <Link
                    to="/admin/applicant/list"
                    className={`flex items-center p-2 rounded-lg group ${
                      isActive("/admin/applicant/list")
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <img
                      src={ApplicantsIcon}
                      className="flex-shrink-0 w-7 h-7"
                      alt="Applicants icon"
                    />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Applicants
                    </span>
                  </Link>
                </li>
              )}
            {user &&
              (user.access_to.includes("Enquiries & Messages") ||
                user.isAdmin) && (
                <li>
                  <Link
                    to="/admin/enquiries&messages/list"
                    className={`flex items-center p-2 rounded-lg group ${
                      isActive("/admin/enquiries&messages/list")
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <img
                      src={EnquiriesIcon}
                      className="flex-shrink-0 w-7 h-7"
                      alt="Enquiries & Messages icon"
                    />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Enquiries
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
              className="flex items-center w-full p-2 text-left text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <img
                src={logout}
                className="flex-shrink-0 transition duration-75 w-7 h-7 group-hover:text-gray-900 dark:group-hover:text-white"
                alt="Log Out icon"
              />
              <span   className="flex-1 ms-3 whitespace-nowrap">Log Out</span>
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
        <div className="relative w-full max-w-md max-h-full p-4">
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
            <div className="p-4 text-center md:p-5">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-200"
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
                onClick={handelLogOut}
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
     