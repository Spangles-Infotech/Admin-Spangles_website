import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { URL } from "../../App";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import { initFlowbite } from "flowbite";

function Preview() {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const params = useParams();
  const [Data, setData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    alternative_mobile_number: "",
    category: "",
    designation: "",
    skills: "",
    experience: "",
    resume: "",
    salary_expectation: "",
    applied_on: "",
    status: "",
  });
  const [Status, setStatus] = useState("");
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  useEffect(() => {
    initFlowbite();
    fetchData();
  }, []);


  

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${URL}/api/applicant/${params.id}/data`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setData(response.data.applicants);
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
      if (error.response.status === 500) {
        setTimeout(() => {
          setResponse({
            status: null,
            message: "",
          });
        }, 5000);
      }
    }
  };
console.log(Data);

  const updateViewState = async () => {
    try {
      await axios.put(
        `${URL}/api/applicant/${params.id}/status/update`,
        {
          status: "Seen",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.error(error);
      
    }
  }

if (Data && Data.status==="View") {
  updateViewState()
  console.log("updateViewState Called");
  
}


  const handleStatus = async () => {
    try {
      const response = await axios.put(
        `${URL}/api/applicant/${params.id}/status/update`,
        {
          status: Status,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setResponse({
        status: "Success",
        message: response.data.message,
      });
      setTimeout(() => {
        navigate(`/admin/applicant/list`);
      }, 5000);
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
      if (error.response.status === 500) {
        setTimeout(() => {
          setResponse({
            status: null,
            message: "",
          });
        }, 5000);
      }
    }
  };
  useEffect(() => {
    setStatus(Data.status);
  }, [Data]);

  return (
    <React.Fragment>
      <div className="flex flex-col p-5 mb-20 space-y-10 bg-white rounded-t-lg">
        <Link to={"/admin/applicant/list"}>
          <i className="text-2xl fa-solid fa-arrow-left-long"></i>
        </Link>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-spangles-700">
            Applicant Summary
          </h3>
        </div>
        <table className="text-xs text-left text-gray-500 w-fit rtl:text-right dark:text-gray-400">
          <tbody className="">
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Name
              </td>
              <td className="px-4 py-3 text-sm">{Data && Data.name}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Email
              </td>
              <td className="px-4 py-3 text-sm">{Data && Data.email}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Mobile Number
              </td>
              <td className="px-4 py-3 text-sm">
                {Data && Data.mobile_number}
              </td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Alternative Mobile Number
              </td>
              <td className="px-4 py-3 text-sm">
                {Data && Data.alternative_mobile_number}
              </td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Category
              </td>
              <td className="px-4 py-3 text-sm">{Data && Data.category}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Designation
              </td>
              <td className="px-4 py-3 text-sm">{Data && Data.designation}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Experience
              </td>
              <td className="px-4 py-3 text-sm ">{Data && Data.experience}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Skills
              </td>
              <td className="px-4 py-3 text-sm">{Data && Data.skills}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Resume
              </td>
              <td className="px-4 py-3 text-sm font-medium underline text-spangles-700">
                <button
                  data-modal-target="resume-modal"
                  data-modal-toggle="resume-modal"
                  class="text-spangles-700 font-medium underline"
                  type="button"
                >
                  View Resume
                </button>
              </td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Salary Expectation
              </td>
              <td className="px-4 py-3 text-sm ">
                {Data && Data.salary_expectation}
              </td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Applied On
              </td>
              <td className="px-4 py-3 text-sm ">
                {moment(Data && Data.applied_on).format("DD-MM-YYYY")}
              </td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Description
              </td>
              <td className="px-4 py-3 text-sm ">{Data && Data.description}</td>
            </tr>
            <tr className="align-middle dark:bg-gray-800 dark:border-gray-700">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Status
              </td>
              {Data && (Data.status === "View" || Data.status === "Seen" || Data.status === "On Hold") ? (
                <td className="max-w-2xl px-4 py-3 text-sm">
                  <ul class="w-full inline-flex items-center space-x-20 text-base font-medium text-gray-900 bg-white border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <li class="">
                      <div class="flex items-center">
                        <input
                          id="shortlisted_button"
                          type="radio"
                          value="Shortlisted"
                          onChange={() => setStatus("Shortlisted")}
                          name="shortlisted_button"
                          checked={Status === "Shortlisted" ? true : false}
                          class="w-4 h-4 text-green-600 bg-gray-100 border-green-600 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="shortlisted_button"
                          class="w-full py-3 ms-2 text-base font-medium text-green-600 dark:text-gray-300"
                        >
                          Shortlisted
                        </label>
                      </div>
                    </li>
                    <li class="">
                      <div class="flex items-center">
                        <input
                          id="hold_button"
                          type="radio"
                          value="On Hold"
                          onChange={() => setStatus("On Hold")}
                          checked={Status === "On Hold" ? true : false}
                          name="hold_button"
                          class="w-4 h-4 text-orange-500 bg-gray-100 border-orange-500 focus:ring-orange-400 dark:focus:ring-orange-500 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="hold_button"
                          class="w-full py-3 ms-2 text-base font-medium text-orange-500 dark:text-gray-300"
                        >
                          On Hold
                        </label>
                      </div>
                    </li>
                    <li class="">
                      <div class="flex items-center">
                        <input
                          id="rejected_button"
                          type="radio"
                          value="Rejected"
                          onChange={() => setStatus("Rejected")}
                          checked={Status === "Rejected" ? true : false}
                          name="rejected_button"
                          class="w-4 h-4 text-red-600 bg-gray-100 border-red-600 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="rejected_button"
                          class="w-full py-3 ms-2 text-base font-medium text-red-600 dark:text-gray-300"
                        >
                          Rejected
                        </label>
                      </div>
                    </li>
                  </ul>
                </td>
              ) : (
                <td
                  className={`${
                    Data.status === "Shortlisted"
                      ? "text-green-600"
                      : "text-red-600"
                  } px-4 py-3 text-sm font-medium`}
                >
                  {Data && Data.status}
                </td>
              )}
            </tr>
          </tbody>
        </table>
        {Data && (Data.status === "View" || Data.status === "Seen" || Data.status === "On Hold") && (
          <div className="flex items-center justify-end w-full space-x-5">
            <button
              onClick={() => handleStatus()}
              type="button"
              class="inline-flex items-center px-16 py-2.5 mt-4 sm:mt-6 font-semibold text-center text-white bg-spangles-700 rounded-lg focus:ring-4 hover:bg-spangles-800  focus:ring-spangles-200"
            >
              Done
            </button>
          </div>
        )}
      </div>
      <div
        id="resume-modal"
        tabindex="-1"
        aria-hidden="true"
        class="hidden bg-opacity-5 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div class="relative p-4 w-fit max-h-full">
          {/* <!-- Modal content --> */}
          <div class="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                <span className="text-teal-700">{Data && Data.name}'s</span>{" "}
                Resume
              </h3>
              <button
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="resume-modal"
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <iframe
              className="m-5"
              width="850"
              height="800"
              src={`${URL}/${Data && Data.resume}`}
            ></iframe>
          </div>
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

export default Preview;
