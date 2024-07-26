import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import filterIcon from "../../assets/Mask group (4)-min.png";
import Spinners from "../../Components/Spinners";
import { initFlowbite } from "flowbite";
import { URL } from "../../App";
import moment from "moment";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";

function List() {
  const [CurrentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  const [Loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [TotalPages, setTotalPages] = useState(1);
  const [CategoryList, setCategoryList] = useState([]);
  const [DesignationList, setDesignationList] = useState([]);
  const [Filter, setFilter] = useState(false);
  const [Category, setCategory] = useState("");
  const [Designation, setDesignation] = useState("");
  const [Search, setSearch] = useState("");
  const [Status, setStatus] = useState("");
  // const [isDate, setDate] = useState({
  //   from: "",
  //   to: "",
  // });

  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(() => {
    fetchData();
  }, [CurrentPage, Search, Designation, Category, Status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${URL}/api/job/list?category=${Category}&designation=${Designation}&status=${Status}&search=${Search}&page=${CurrentPage}&limit=${15}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setData(response.data.jobs);
      setTotalPages(response.data.TotalPages);
      setCurrentPage(response.data.CurrentPage);
      setCategoryList(response.data.categories);
      setDesignationList(response.data.designations);
    } catch (error) {
      console.error(error);
      setResponse({
        status: "Failed",
        message: error.response ? error.response.data.message : error.message,
      });
      if (error.response.status === 401) {
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 5000);
      }
    } finally {
      setResponse({
        status: null,
        message: "",
      });
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <div className="flex flex-col bg-white p-5 space-y-10 rounded-t-lg">
        <div className="flex flex-wrap space-y-5 items-center justify-between">
          <div className="inline-flex space-x-3 items-center">
            <h1 className="font-semibold text-lg text-spangles-700">
              Jobs List
            </h1>
            <button
              onClick={() => {
                setFilter((prev) => !prev);
                setCategory("");
                setDesignation("");
                setStatus("");
              }}
              className="bg-gray-50 border text-spangles-800 text-xs font-semibold rounded focus:ring-spangles-800 focus:border-spangles-800 block w-fit px-2 py-0.5 hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
            >
              <div className="inline-flex items-center gap-2">
                <img src={filterIcon} alt="" /> Filters
                {Filter && <i className="fa-solid fa-xmark mt-0.5"></i>}
              </div>
            </button>
            {Filter && (
              <div className="flex flex-wrap space-x-5 items-center">
                <div className="inline-flex items-center space-x-3">
                  <h6 className="text-sm">Category :</h6>
                  <select
                    id="category"
                    value={Category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-50 border text-spangles-800 text-xs font-semibold rounded focus:ring-spangles-800 focus:border-spangles-800 block w-fit px-2 py-1 hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
                  >
                    <option value="">All</option>
                    {CategoryList &&
                      CategoryList.map((items, index) => (
                        <option value={items} key={index}>
                          {items}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="inline-flex items-center space-x-3">
                  <h6 className="text-sm">Designation :</h6>
                  <select
                    id="designation"
                    value={Designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="bg-gray-50 border text-spangles-800 text-xs font-semibold rounded focus:ring-spangles-800 focus:border-spangles-800 block w-fit px-2 py-1 hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
                  >
                    <option value="">All</option>
                    {DesignationList &&
                      DesignationList.map((items, index) => (
                        <option value={items} key={index}>
                          {items}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="inline-flex items-center space-x-3">
                  <h6 className="text-sm">Status :</h6>
                  <select
                    id="status"
                    value={Status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-gray-50 border text-spangles-800 text-xs font-semibold rounded focus:ring-spangles-800 focus:border-spangles-800 block w-fit px-2 py-1 hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
                  >
                    <option value="">All</option>
                    {["Active", "On Hold", "In Active"].map((items, index) => (
                      <option value={items} key={index}>
                        {items}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-5">
            <div>
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-3 h-3 text-gray-500 dark:text-gray-400"
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
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-40 py-1 ps-8 text-sm text-gray-900 rounded bg-gray-50 focus:ring-spangles-800 focus:border-spangles-800 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <Link
              to={`/admin/job-post/add/new`}
              className="px-3 py-1 text-white bg-spangles-700 rounded text-sm space-x-2 hover:bg-spangles-800 focus:ring-4 focus:ring-spangles-200"
            >
              <span>
                <i className="fa-solid fa-plus"></i> New Job
              </span>
            </Link>
          </div>
        </div>
        {Loading ? (
          <Spinners />
        ) : Data.length === 0 ? (
          <div>No Records Found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {[
                    "Sl.No",
                    "Category",
                    "Designation",
                    "Experience",
                    "Posted On",
                    "Status",
                    "Action",
                  ].map((item, index) => (
                    <th scope="col" className="px-6 py-3" key={index}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Data &&
                  Data.map((elem, index) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={index}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {(CurrentPage - 1) * 15 + (index + 1)}
                      </th>
                      <td className="px-6 py-4">{elem.category}</td>
                      <td className="px-6 py-4">{elem.designation}</td>
                      <td className="px-6 py-4">{elem.work_experience}</td>
                      <td className="px-6 py-4">
                        {moment(elem.posted_on).format("DD-MM-YYYY")}
                      </td>
                      <td
                        className={`${
                          elem.status === "Active"
                            ? "text-green-600"
                            : elem.status === "On Hold"
                            ? "text-orange-500"
                            : "text-red-600"
                        } px-6 py-4 font-medium`}
                      >
                        {elem.status}
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/admin/job-post/${elem._id}/preview`}>
                          <i className="fa-solid fa-eye"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(CurrentPage - 1)}
            disabled={CurrentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled
            className={`px-4 py-2 rounded ${
              CurrentPage
                ? "bg-spangles-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {CurrentPage}
          </button>
          <button
            onClick={() => setCurrentPage(CurrentPage + 1)}
            disabled={CurrentPage === TotalPages || TotalPages === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {Response.status !== null ? (
        Response.status === "Success" ? (
          <SuccessMessage Message={Response.message} />
        ) : Response.status === "Failed" ? (
          <FailedMessage Message={Response.message} />
        ) : null
      ) : null}
    </React.Fragment>
  );
}

export default List;
