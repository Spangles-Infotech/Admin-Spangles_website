import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { URL } from "../../App";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";

function Preview() {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const params = useParams();
  const [Data, setData] = useState({
    _id: "",
    category: "",
    designation: "",
    work_experience: "",
    preferred_skills: [],
    job_summary: "",
    responsibilities_and_duties: [],
    required_experience_and_qualifications: [],
    posted_on: "",
    status: "",
  });
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  useEffect(() => {
    fetchData();
  }, [params]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${URL}/api/job/${params.id}/data`, {
        headers: {
          Authorization: token,
        },
      });
      setData(response.data.jobs);
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        setResponse({
          status: "Failed",
          message: "Un Authorized! Please Login Again.",
        });
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 5000);
      }
      if (error.response.status === 500) {
        setResponse({
          status: "Failed",
          message: "Server Unavailable!",
        });
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
      <div className="flex flex-col bg-white p-5 mb-20 space-y-10 rounded-t-lg">
        <Link to={"/admin/job-post/list"}>
          <i className="fa-solid fa-arrow-left-long text-2xl"></i>
        </Link>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-teal-700">Job Details</h3>
          <div className="inline-flex space-x-10">
            <h6
              className={`${
                Data && Data.status === "Active"
                  ? "text-green-600 "
                  : Data && Data.status === "In Active"
                  ? "text-red-600"
                  : "text-orange-500"
              } text-sm font-medium`}
            >
              {Data && Data.status}
            </h6>
            <Link
              to={`/admin/job-post/${Data && Data._id}/edit`}
              className="text-teal-700 hover:text-teal-500 text-sm font-medium"
            >
              <i className="fa-solid fa-pen-to-square"></i> Edit
            </Link>
          </div>
        </div>
        <table className="w-fit text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <tbody className="">
            <tr className="align-top">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Category
              </td>
              <td className="px-4 py-3 text-sm">{Data && Data.category}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Designation
              </td>
              <td className="px-4 py-3 text-sm">{Data && Data.designation}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-sm font-medium  text-gray-700">
                Work Experience
              </td>
              <td className="px-4 py-3 text-sm ">
                {Data && Data.work_experience}
              </td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-sm font-medium  text-gray-700">
                Preferred Skills
              </td>
              <td className="px-4 py-3 text-sm ">
                {Data && Data.preferred_skills.join(", ")}
              </td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-sm font-medium  text-gray-700">
                Job Summary
              </td>
              <td className="px-4 py-3 text-sm ">{Data && Data.job_summary}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Responsibilities and Duties
              </td>
              <td className="px-4 py-3 text-sm ">
                <ul className="list-disc p-5 border-2 rounded space-y-2">
                  {Data &&
                    Data.responsibilities_and_duties.map((elem, idx) => (
                      <li key={idx} className="ms-2">
                        {elem}
                      </li>
                    ))}
                </ul>
              </td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-sm font-medium text-gray-700 w-1/5">
                Required Experience and Qualifications
              </td>
              <td className="px-4 py-3 text-sm ">
                <ul className="list-disc p-5 border-2 rounded space-y-2">
                  {Data &&
                    Data.required_experience_and_qualifications.map(
                      (elem, idx) => (
                        <li key={idx} className="ms-2">
                          {elem}
                        </li>
                      )
                    )}
                </ul>
              </td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-sm font-medium  text-gray-700">
                Posted On
              </td>
              <td className="px-4 py-3 text-sm ">
                {moment(Data && Data.posted_on).format("DD-MM-YYYY")}
              </td>
            </tr>
          </tbody>
        </table>
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
