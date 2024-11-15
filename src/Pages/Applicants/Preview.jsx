import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { URL } from "../../App";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import { initFlowbite } from "flowbite";
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function Preview() {
  const notify = (e) =>toast.success(e, {
    position: 'top-right',
     
  });

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
 
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
  
  const [ReasonForStatus, setReasonForStatus] = useState({
    status: null,
    message: "",  // Corrected spelling
  });

  const handleReasonStatus = (e) => {
    // Check if Data is available and the input isn't empty
    if (Data && Data.status !== Status ) {
      setReasonForStatus({
        ...ReasonForStatus,
        message: e.target.value,  // Correct field name
        status: Status,           // Update status with the current Status
      });
    }
  };

  




  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  useEffect(() => {
    initFlowbite();
    fetchData();
    setReasonForStatus({
      status: null,
      message: "",  
    })
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
          navigate(-1); 
        }, 1000);
      }
      if (error.response.status === 500) {
        setTimeout(() => {
          setResponse({
            status: null,
            message: "",
          });
        }, 1000);
      }
    }
  };

  const updateViewState = async () => {
    try {
     const response = await axios.put(
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
      if (response.data?.message === "seen updated successfully") {
        setData(prevData => ({
          ...prevData,
          status: "Seen"
        }));
      }
      // window.location.reload(); 
    } catch (error) {
      console.error(error);
      
    }
  }

if (Data && Data.status==="View") {
  updateViewState()
  
}



const handleStatus = async (e) => {
  e.preventDefault();
  const dataToUpdate = { status:ReasonForStatus.status, ReasonForStatus };

  try {
    const response = await axios.put(`${URL}/api/applicant/${params.id}/applicant_status/update`, dataToUpdate, {
      headers: { Authorization: token },
    });
    if (response.data?.message === "Applicant updated successfully") {
      notify(response.data.message);
      setTimeout(() => {
      navigate(-1) || window.history.back();
      }, 2000);
    }

 
  } catch (error) {
    // handleError(error);
  }
};
  useEffect(() => {
    setStatus(Data.status);
  }, [Data]);

  

  return (
    <>
     {/* <Toaster/>  */}
     <Toaster
  containerStyle={{
    top: 80,
    left: 20,
    bottom: 20,
    right: 0,
  }} toastOptions={{
   
    duration: 1000,
  }}
/>
      <div className="flex flex-col p-5 mt-5 space-y-10 bg-white rounded-t-lg">
      <div className=" fixed w-full space-y-4  top-[80px]   bg-white  ">
      <br/>
        <p  className="">
        <span onClick={() => navigate(-1) || window.history.back()} className="">
          <i   className="text-2xl hover:cursor-pointer fa-solid fa-arrow-left-long"></i>
          </span>
        </p>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold p text-spangles-700">
            Applicant Summary    
          </h3>
        </div>
        </div>
        <br/>
        <br/>
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
                  className="font-medium underline text-spangles-700"
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
                  <ul className="inline-flex items-center w-full space-x-20 text-base font-medium text-gray-900 bg-white border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <li className="">
                      <div className="flex items-center">
                        <input
                          id="shortlisted_button"
                          type="radio"
                          value="Shortlisted"
                          onChange={() => setStatus("Shortlisted")}
                          name="shortlisted_button"
                          checked={Status === "Shortlisted" ? true : false}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-green-600 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="shortlisted_button"
                          className="w-full py-3 text-base font-medium text-green-600 ms-2 dark:text-gray-300"
                        >
                          Shortlisted
                        </label>
                      </div>
                    </li>
                    <li className="">
                      <div className="flex items-center">
                        <input
                          id="hold_button"
                          type="radio"
                          value="On Hold"
                          onChange={() => setStatus("On Hold")}
                          checked={Status === "On Hold" ? true : false}
                          name="hold_button"
                          className="w-4 h-4 text-orange-500 bg-gray-100 border-orange-500 focus:ring-orange-400 dark:focus:ring-orange-500 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="hold_button"
                          className="w-full py-3 text-base font-medium text-orange-500 ms-2 dark:text-gray-300"
                        >
                          On Hold
                        </label>
                      </div>
                    </li>
                    <li className="">
                      <div className="flex items-center">
                        <input
                          id="rejected_button"
                          type="radio"
                          value="Rejected"
                          onChange={() => setStatus("Rejected")}
                          checked={Status === "Rejected" ? true : false}
                          name="rejected_button"
                          className="w-4 h-4 text-red-600 bg-gray-100 border-red-600 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="rejected_button"
                          className="w-full py-3 text-base font-medium text-red-600 ms-2 dark:text-gray-300"
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

        {Data && Data.ReasonForStatus && Data.ReasonForStatus.length > 0 ? (
  <ul className="p-5 space-y-2 list-disc border-2 rounded">
    {Data.ReasonForStatus.map((elem, idx) => (
      <li
        key={idx}
        className={`text-base font-bold ${
          elem.status === "Shortlisted"
            ? "text-green-600"
            : elem.status === "On Hold"
            ? "text-orange-500"
            : elem.status === "Rejected"
            ? "text-red-600"
            : "text-black"
        } px-1 text-sm font-medium`}
      >
        {elem.status} :<span className="text-black"> {elem.message} </span>
      </li>
    ))}
  </ul>
) : null}

                {Data && (Data.status !== "View" && Data.status !== "Seen" &&  Status !== Data.status || Status !== Data.status) ? (
  <div className="mt-4">
    <label htmlFor="message" className="block text-base font-medium text-gray-700">Reason for<span className={`text-base font-bold ${
                    Status === "Shortlisted"
                      ? "text-green-600"
                      :Status === "On Hold"
                      ? "text-orange-500"
                      :Status === "Rejected"
                      ?"text-red-600"
                      :"text-red-600"

                  } px-1 text-sm font-medium`}  >{Status}</span> </label>
    <textarea
  value={ReasonForStatus.message}  // Bind to the 'message' field
  id="message"
  className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
  onChange={handleReasonStatus}    // Simplified function call
  placeholder="Leave a comment..."
></textarea>
  </div>
) : null }
    

{/* {Data  ? (
          <div className="flex items-center justify-end w-full space-x-5">
            <button
              onClick={(e) => handleStatus(e)}
              type="button"
              className="inline-flex items-center px-16 py-2.5 mt-4 sm:mt-6 font-semibold text-center text-white bg-spangles-700 rounded-lg focus:ring-4 hover:bg-spangles-800  focus:ring-spangles-200"
            >
              Done
            </button>
          </div>
        ) : null } */}
{Data && Data.status !== "View" && Data.status !== "Seen" &&  Status !== Data.status || Status !== Data.status ? (
          <div className="flex items-center justify-end w-full space-x-5">
            <div
              onClick={(e) => handleStatus(e)}
              className=" active:text-lg hover:cursor-pointer inline-flex items-center px-16 py-2.5 mt-4 sm:mt-6 font-semibold text-center text-white bg-spangles-700 rounded-lg focus:ring-4 hover:bg-spangles-800  focus:ring-spangles-200"
            >
              Done
            </div>
          </div>
        ) : null }


       
      </div>
      <div
        id="resume-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="hidden bg-opacity-5 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative max-h-full p-4 w-fit">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                <span className="text-teal-700">{Data && Data.name}'s</span>{" "}
                Resume
              </h3>
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="resume-modal"
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
    </>
  );
}

export default Preview;
