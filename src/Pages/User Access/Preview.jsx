import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { URL } from "../../App";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import crypto from "crypto-js";
const Secret_key = import.meta.env.VITE_SECRET_KEY;
function Preview() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const params = useParams();
  const [Data, setData] = useState({
    name: "",
    phone_number: "",
    username: "",
    password: {
      iv: "",
      key: "",
      encryptedData: "",
    },
    access_to: [],
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
      const response = await axios.get(`${URL}/api/user/${params.id}/data`, {
        headers: {
          Authorization: token,
        },
      });
      setData(response.data.user);
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
  const handleAccess = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${URL}/api/user/${params.id}/update/access`,
        { access_to: Data.access_to },
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
        navigate("/admin/user-access/list");
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
  const decryptPassword = (encrypted) => {
    const { iv, encryptedData } = encrypted;
    const key = crypto.enc.Utf8.parse(Secret_key);
    const ivHex = crypto.enc.Hex.parse(iv);
    const encryptedHexStr = crypto.enc.Hex.parse(encryptedData);
    const encryptedBase64Str = crypto.enc.Base64.stringify(encryptedHexStr);
    const decrypted = crypto.AES.decrypt(encryptedBase64Str, key, {
      iv: ivHex,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    });
    return decrypted.toString(crypto.enc.Utf8);
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${URL}/api/user/${params.id}/delete`,
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
        navigate("/admin/user-access/list");
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
      setTimeout(() => {
        setResponse({
          status: null,
          message: "",
        });
      }, 5000);
    }
  };
  return (
    <React.Fragment>
      <div className="flex flex-col bg-white p-5 mb-20 space-y-10 rounded-t-lg">
        <Link to={"/admin/user-access/list"}>
          <i className="fa-solid fa-arrow-left-long text-2xl"></i>
        </Link>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-spangles-700">
            User Details
          </h3>
          <div className="inline-flex space-x-10">
            {user && user.isAdmin && (
              <button
                onClick={() => handleDelete()}
                className="text-red-700 hover:text-red-500 text-sm font-medium p-2.5"
              >
                <i class="fa-solid fa-trash-can"></i> Delete
              </button>
            )}
          </div>
        </div>
        <table className="w-fit text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <tbody className="">
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Name
              </td>
              <td className="px-4 py-3 text-base">{Data && Data.name}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium text-gray-700">
                Phone Number
              </td>
              <td className="px-4 py-3 text-base">
                {Data && Data.phone_number}
              </td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium  text-gray-700">
                Username
              </td>
              <td className="px-4 py-3 text-base ">{Data && Data.username}</td>
            </tr>
            <tr className="align-top">
              <td className="px-4 py-3 text-base font-medium  text-gray-700">
                Password
              </td>
              <td className="px-4 py-3 text-base ">
                {decryptPassword(Data && Data.password)}
              </td>
            </tr>
          </tbody>
        </table>
        <form onSubmit={handleAccess} className="sm:col-span-2 px-4">
          <div className="flex flex-col space-y-3">
            <h6 className="block font-medium text-gray-900 dark:text-white">
              Status
            </h6>
            <ul className="w-full inline-flex items-center space-x-20 text-base font-medium text-gray-900 bg-white border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <li className="">
                <div className="flex items-center">
                  <input
                    id="job_post"
                    type="checkbox"
                    name="job_post"
                    onChange={(ev) => {
                      if (ev.target.checked) {
                        const update = [...Data.access_to];
                        update.splice(0, 0, "Job Post");
                        setData((prev) => {
                          return {
                            ...prev,
                            access_to: update,
                          };
                        });
                      } else {
                        const update = [...Data.access_to];
                        update.splice(0, 1);
                        setData((prev) => {
                          return {
                            ...prev,
                            access_to: update,
                          };
                        });
                      }
                    }}
                    checked={Data.access_to.includes("Job Post")}
                    className="w-4 h-4 text-spangles-600 bg-gray-100 border-spangles-600 focus:ring-spangles-500 dark:focus:ring-spangles-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor="job_post"
                    className="w-full py-3 ms-2 text-base font-medium text-spangles-600 dark:text-gray-300"
                  >
                    Job Post
                  </label>
                </div>
              </li>
              <li className="">
                <div className="flex items-center">
                  <input
                    id="blogs"
                    type="checkbox"
                    onChange={(ev) => {
                      if (ev.target.checked) {
                        const update = [...Data.access_to];
                        update.splice(1, 0, "Blogs");
                        setData((prev) => {
                          return {
                            ...prev,
                            access_to: update,
                          };
                        });
                      } else {
                        const update = [...Data.access_to];

                        update.splice(1, 1);
                        setData((prev) => {
                          return {
                            ...prev,
                            access_to: update,
                          };
                        });
                      }
                    }}
                    checked={Data.access_to.includes("Blogs")}
                    name="blogs"
                    className="w-4 h-4 text-spangles-600 bg-gray-100 border-spangles-600 focus:ring-spangles-500 dark:focus:ring-spangles-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor="blogs"
                    className="w-full py-3 ms-2 text-base font-medium text-spangles-500 dark:text-gray-300"
                  >
                    Blogs
                  </label>
                </div>
              </li>
              <li className="">
                <div className="flex items-center">
                  <input
                    id="gallery"
                    type="checkbox"
                    onChange={(ev) => {
                      if (ev.target.checked) {
                        const update = [...Data.access_to];
                        update.splice(2, 0, "Gallery");
                        setData((prev) => {
                          return {
                            ...prev,
                            access_to: update,
                          };
                        });
                      } else {
                        const update = [...Data.access_to];
                        update.splice(2, 1);
                        setData((prev) => {
                          return {
                            ...prev,
                            access_to: update,
                          };
                        });
                      }
                    }}
                    checked={Data.access_to.includes("Gallery")}
                    name="gallery"
                    className="w-4 h-4 text-spangles-600 bg-gray-100 border-spangles-600 focus:ring-spangles-500 dark:focus:ring-spangles-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor="gallery"
                    className="w-full py-3 ms-2 text-base font-medium text-spangles-600 dark:text-gray-300"
                  >
                    Gallery
                  </label>
                </div>
              </li>
              <li className="">
                <div className="flex items-center">
                  <input
                    id="applicants"
                    type="checkbox"
                    onChange={(ev) => {
                      if (ev.target.checked) {
                        const update = [...Data.access_to];
                        update.splice(3, 0, "Appicants");
                        setData((prev) => {
                          return {
                            ...prev,
                            access_to: update,
                          };
                        });
                      } else {
                        const update = [...Data.access_to];
                        update.splice(3, 1);
                        setData((prev) => {
                          return {
                            ...prev,
                            access_to: update,
                          };
                        });
                      }
                    }}
                    checked={Data.access_to.includes("Applicants")}
                    name="applicants"
                    className="w-4 h-4 text-spangles-600 bg-gray-100 border-spangles-600 focus:ring-spangles-500 dark:focus:ring-spangles-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor="applicants"
                    className="w-full py-3 ms-2 text-base font-medium text-spangles-600 dark:text-gray-300"
                  >
                    Applicants
                  </label>
                </div>
              </li>
              <li className="">
                <div className="flex items-center">
                  <input
                    id="enquiries&messages"
                    type="checkbox"
                    onChange={(ev) => {
                      if (ev.target.checked) {
                        const update = [...Data.access_to];
                        update.splice(4, 0, "Enquiries & Messages");
                        setData((prev) => {
                          return {
                            ...prev,
                            access_to: update,
                          };
                        });
                      } else {
                        const update = [...Data.access_to];
                        update.splice(4, 1);
                        setData((prev) => {
                          return {
                            ...prev,
                            access_to: update,
                          };
                        });
                      }
                    }}
                    checked={Data.access_to.includes("Enquiries & Messages")}
                    name="enquiries&messages"
                    className="w-4 h-4 text-spangles-600 bg-gray-100 border-spangles-600 focus:ring-spangles-500 dark:focus:ring-spangles-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor="enquiries&messages"
                    className="w-full py-3 ms-2 text-base font-medium text-spangles-600 dark:text-gray-300"
                  >
                    Enquiries & Messages
                  </label>
                </div>
              </li>
            </ul>
          </div>
          <div className="w-full flex items-center justify-end space-x-5">
            <button
              type="submit"
              className="inline-flex items-center px-14 py-2.5 mt-4 sm:mt-6 text-base font-semibold text-center text-white bg-spangles-700 rounded-lg focus:ring-4 hover:bg-spangles-800  focus:ring-spangles-200"
            >
              Update
            </button>
          </div>
        </form>
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
