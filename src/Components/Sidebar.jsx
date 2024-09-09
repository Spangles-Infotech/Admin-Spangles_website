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
          {/* Logout section remains the same */}
        </div>
      </aside>
    </React.Fragment>
  );
}

export default Sidebar;
