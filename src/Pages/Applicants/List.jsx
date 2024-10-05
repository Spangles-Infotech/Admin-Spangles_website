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
      <div className="flex flex-col w-full p-5 space-y-10 bg-white rounded-t-lg">
        <div className="flex fixed space-y-4 p-5 top-[80px] h-20 bg-white  flex-wrap items-end justify-between w-full gap-5">
          <div className="inline-flex items-start space-x-3 text-nowrap">
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
              className="bg-gray-50 border text-spangles-800 text-xs font-semibold rounded focus:ring-spangles-800 focus:border-spangles-800 block w-fit px-2 py-0.5 hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
            >
              <div className="inline-flex items-center gap-2">
                <img src={filterIcon} alt="" /> Filters
                {Filter && <i className="fa-solid fa-xmark mt-0.5"></i>}
              </div>
            </button>
            {Filter && (
              <div className="flex flex-wrap items-center gap-5">
                {/* Filters for Category, Designation, Status, and Date */}
                {/* Category */}
                <div className="inline-flex items-center space-x-3">
                  <h6 className="text-sm">Category :</h6>
                  <select
                    id="category"
                    value={Category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block px-2 py-1 text-xs font-semibold border rounded bg-gray-50 text-spangles-800 focus:ring-spangles-800 focus:border-spangles-800 w-fit hover:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-800 dark:focus:border-spangles-800"
                  >
                    <option value="">All</option>
                    {CategoryList.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                {/* More filter options for Designation, Status, and Date */}
                {/* ... */}
              </div>
            )}
          </div>
        </div>

        {/* Data Loading and Display */}
        {Loading ? (
          <Spinners />
        ) : Data.length === 0 ? (
          <div>No Records Found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
              <thead className="text-sm text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {["Sl.No", "Name", "Category", "Designation", "Experience", "Applied On", "Status", "Action"].map((item, index) => (
                    <th scope="col" className="px-6 py-3" key={index}>
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
