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
    message: "",
    received_on: "",
    status: "",
  });
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  useEffect(() => {
    initFlowbite();
    fetchData();
    handleStatus()
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${URL}/api/spanglesApplicant/${params.id}/data`,
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
      setTimeout(() => {
        setResponse({
          status: null,
          message: "",
        });
      }, 5000);
    }
  };
  
  const handleStatus = async () => {
    try {
      const response = await axios.put(
        `${URL}/api/spanglesApplicant/${params.id}/status/update`,
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
      // setResponse({
      //   status: "Failed",
      //   message: error.response ? error.response.data.message : error.message,
      // });
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

  return (
    <React.Fragment>
      <div className="flex flex-col p-5 mb-20 space-y-10 bg-white rounded-t-lg">
        <Link to={"/admin/register/list"}>
          <i className="text-2xl fa-solid fa-arrow-left-long"></i>
        </Link>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-spangles-700">
          Registration
          </h3>
        </div>
        <table className="text-xs text-left text-gray-500 w-fit rtl:text-right dark:text-gray-400">
  <tbody>
  <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">Spangles Id</td>
      <td className="px-4 py-3 text-sm">{Data && Data.spanglesApplicantId}</td>
    </tr>
    <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">Applied On</td>
      <td className="px-4 py-3 text-sm">
        {moment(Data && Data.applied_on).format("DD-MM-YYYY")}
      </td>
    </tr>
    <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">Name</td>
      <td className="px-4 py-3 text-sm">{Data && Data.name}</td>
    </tr>
    <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">Email</td>
      <td className="px-4 py-3 text-sm">{Data && Data.email}</td>
    </tr>
    <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">Mobile</td>
      <td className="px-4 py-3 text-sm">{Data && Data.mobile_number}</td>
    </tr>
    <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">College</td>
      <td className="px-4 py-3 text-sm">{Data && Data.college_name}</td>
    </tr>
    <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">Position</td>
      <td className="px-4 py-3 text-sm">{Data && Data.position_applied_for}</td>
    </tr>

    <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">Prefered Location</td>
      <td className="px-4 py-3 text-sm">{Data && Data.preferred_job_location}</td>
    </tr>

    <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">Willing to Relocate</td>
      <td className="px-4 py-3 text-sm">{Data && Data.willing_to_relocate}</td>
    </tr>

    <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">Position</td>
      <td className="px-4 py-3 text-sm">{Data && Data.position_applied_for}</td>
    </tr>
    <tr className="align-top">
      <td className="px-4 py-3 text-base font-medium text-gray-700">Interest in</td>
      <td className="px-4 py-3 text-sm">{Data && Data.interested_in}</td>
    </tr>

  </tbody>
</table>

        {Data && Data.status === "New" || Data.status === "Seen" && (
          <div className="flex items-center justify-end w-full space-x-5">
            <Link
              to={"/admin/register/list"}
               class="inline-flex items-center px-16 py-2.5 mt-4 sm:mt-6 font-semibold text-center text-white bg-spangles-700 rounded-lg focus:ring-4 hover:bg-spangles-800  focus:ring-spangles-200"
            >
              Done
            </Link>
          </div>
        )}
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
