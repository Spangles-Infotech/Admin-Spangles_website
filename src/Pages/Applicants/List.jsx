import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import filterIcon from "../../assets/Mask group (4)-min.png";
import Spinners from "../../Components/Spinners";
import { initFlowbite } from "flowbite";
import { URL } from "../../App";
import moment from "moment";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";

function List() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  
  const [CurrentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [Category, setCategory] = useState(searchParams.get('category') || "");
  const [Designation, setDesignation] = useState(searchParams.get('designation') || "");
  const [Search, setSearch] = useState(searchParams.get('search') || "");
  const [Status, setStatus] = useState(searchParams.get('status') || "");
  const [isDate, setDate] = useState({
    from: searchParams.get('from') || "",
    to: searchParams.get('to') || "",
  });
  const [Data, setData] = useState([]);
  const [TotalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [Response, setResponse] = useState({ status: null, message: "" });
  const [CategoryList, setCategoryList] = useState([]);
  const [DesignationList, setDesignationList] = useState([]);
  const [Filter, setFilter] = useState(false);

  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(() => {
    fetchData();
  }, [CurrentPage, Category, Designation, Status, isDate, Search]);

  const updateSearchParams = () => {
    setSearchParams({
      category: Category || "",
      designation: Designation || "",
      status: Status || "",
      from: isDate.from || "",
      to: isDate.to || "",
      search: Search || "",
      page: CurrentPage || 1,
    });
  };

  useEffect(() => {
    updateSearchParams();
  }, [CurrentPage, Category, Designation, Status, isDate, Search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${URL}/api/applicant/list?category=${Category}&designation=${Designation}&status=${Status}&from=${
          isDate.from
        }&to=${isDate.to}&search=${Search}&page=${CurrentPage}&limit=15`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setData(response.data.applicants);
      setTotalPages(response.data.TotalPages);
      setCategoryList(response.data.categories);
      setDesignationList(response.data.designations);
    } catch (error) {
      console.error(error);
      setResponse({
        status: "Failed",
        message: error.response ? error.response.data.message : error.message,
      });
      if (error.response?.status === 401) {
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-col w-full p-5 space-y-10 bg-white  rounded-t-lg">
        <div className="flex fixed space-y-4   p-1 top-[80px] h-30 bg-white  flex-wrap items-center  gap-5 w-full  ">
          <div className="flex w-[55%] items-center space-x-3 text-nowrap">
            <h1 className="text-lg font-semibold text-spangles-700">
              Applicant List
            </h1>
            <button
              onClick={() => {
                setFilter((prev) => !prev);
                setCategory("");
                setDesignation("");
                setStatus("");
                setDate({ from: "", to: "" });
              }}
              className="bg-gray-50 border text-spangles-800 text-xs font-semibold rounded focus:ring-spangles-800 focus:border-spangles-800 block w-[100px] px-2 py-0.5 hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
            >
              <div className="inline-flex items-center gap-2">
                <img src={filterIcon} alt="" /> Filters
                {Filter && <i className="fa-solid fa-xmark mt-0.5"></i>}
              </div>
            </button>
            {Filter && (
              <div className="flex flex-wrap items-center  relative   gap-2 w-[550px]">
                {/* Filters for Category, Designation, Status, and Date */}
                {/* Category */}
                <div className=" flex items-center space-x-3">
                  <h6 className="text-sm">Category :</h6>
                  <select
                    id="category"
                    value={Category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block px-2 py-1 text-xs font-semibold border rounded bg-gray-50 text-spangles-800 focus:ring-spangles-800 focus:border-spangles-800 w-[100px]  hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
                  >
                    <option value="">All</option>
                    {CategoryList.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="inline-flex items-center space-x-3">
                  <h6 className="text-sm">Designation :</h6>
                  <select
                    id="designation"
                    value={Designation}
                    onChange={(e) => {
                      setDesignation(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block px-2 py-1 w-[100px] text-xs font-semibold border rounded bg-gray-50 text-spangles-800 focus:ring-spangles-800 focus:border-spangles-800  hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
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
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block px-2 py-1 text-xs font-semibold border rounded bg-gray-50 text-spangles-800 focus:ring-spangles-800 focus:border-spangles-800 w-fit hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
                  >
                    <option value="">All</option>
                    {["View", "Seen", "Shortlisted", "On Hold", "Rejected"].map(
                      (items, index) => (
                        <option value={items} key={index}>
                          {items}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="inline-flex items-center space-x-3">
                  <h6 className="text-sm">From :</h6>
                  <input
                    type="date"
                    name="from"
                    id="from"
                    onChange={(e) => {
                      setDate({ ...isDate, from: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="block px-2 py-1 text-xs font-semibold text-teal-800 border rounded bg-gray-50 focus:ring-teal-800 focus:border-teal-800 w-fit hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-800 dark:focus:border-teal-800"
                  />
                  <h6 className="text-sm">To :</h6>
                  <input
                    type="date"
                    name="to"
                    id="to"
                    onChange={(e) => {
                      setDate({ ...isDate, to: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="block px-2 py-1 text-xs font-semibold text-teal-800 border rounded bg-gray-50 focus:ring-teal-800 focus:border-teal-800 w-fit hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-800 dark:focus:border-teal-800"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex  bg-slate-400 space-x-5">
            <div className="bg-slate-400 ">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                  <svg
                    className="w-3 h-3 cursor-pointer text-gray-500 dark:text-gray-400"
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
                  className="block w-40 py-1 text-sm text-gray-900 rounded ps-8 bg-gray-50 focus:ring-spangles-800 focus:border-spangles-800 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>



        {/* Data Loading and Display */}
        {Loading ? (
          <Spinners />
        ) : Data.length === 0 ? (
          <div>No Records Found</div>
        ) : (
          <div className="overflow-x-auto  pt-5">
            <table className="w-full  text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
              <thead className="text-sm  text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {["Sl.No", "Name", "Category", "Designation", "Experience", "Applied On", "Status", "Action"].map((item, index) => (
                    <th scope="col" className="px-6 mt-5 py-3" key={index}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Data.map((elem, index) => (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {(CurrentPage - 1) * 15 + (index + 1)}
                    </th>
                    <td className="px-6 py-4">{elem.name}</td>
                    <td className="px-6 py-4">{elem.category}</td>
                    <td className="px-6 py-4">{elem.designation}</td>
                    <td className="px-6 py-4">{elem.experience}</td>
                    <td className="px-6 py-4">{moment(elem.applied_on).format("DD-MM-YYYY")}</td>
                    <td className={`px-6 py-4 font-medium ${elem.status === "Shortlisted" ? "text-green-600" : elem.status === "On Hold" ? "text-orange-500" : elem.status === "Rejected" ? "text-red-600" : elem.status === "View" ? "text-blue-600" : "text-green-500"}`}>
                      {elem.status}
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/admin/applicant/${elem._id}/preview`}>
                        <i className="fa-solid fa-eye"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(CurrentPage - 1)}
            disabled={CurrentPage === 1}
            className="px-4 py-2 w-[100px] bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled
            className="px-4 py-2 rounded bg-spangles-600 text-white"
          >
            {CurrentPage}
          </button>
          <button
            onClick={() => setCurrentPage(CurrentPage + 1)}
            disabled={CurrentPage === TotalPages || TotalPages === 0}
            className="px-4 py-2 w-[100px] bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default List;
