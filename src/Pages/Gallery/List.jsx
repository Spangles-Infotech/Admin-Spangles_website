import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import filterIcon from "../../assets/Mask group (4)-min.png";
import Spinners from "../../Components/Spinners";
import { initFlowbite } from "flowbite";
import { URL } from "../../App";
// import moment from "moment";
import UploadLink from "../../Components/UploadLink";
import UploadFiles from "../../Components/UploadFiles";
// import InfiniteScroll from "react-infinite-scroll-component";
import ReactPlayer from "react-player";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";

function List() {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  const [Data, setData] = useState([]);
  const [CurrentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [Delete, setDelete] = useState(null);

  useEffect(() => {
    initFlowbite();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${URL}/api/gallery/list?page=${CurrentPage}&limit=${20}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setData(response.data.galleryData);
      setCurrentPage(response.data.CurrentPage);
      setTotalPages(response.data.TotalPages);
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
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${URL}/api/gallery/${id}/delete`, {
        headers: {
          Authorization: token,
        },
      });
      setDelete(null);
      setData(response.data.galleryData);
      setResponse({
        status: "Success",
        message: response.data.message,
      });
      setTimeout(() => {
        setResponse({
          status: null,
          message: "",
        });
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

  return (
    <React.Fragment>
      <div className="flex flex-col bg-white p-5 space-y-10 rounded-t-lg">
        <div className="flex flex-wrap space-y-5 items-center justify-between">
          <h1 className="font-semibold text-lg text-spangles-700">Gallery</h1>
          <div className="flex items-center space-x-5">
            <button
              type="button"
              className="px-3 py-1 text-white bg-spangles-700 rounded text-sm space-x-2 hover:bg-spangles-800 focus:ring-4 focus:ring-spangles-200"
              data-modal-target="link-modal"
              data-modal-toggle="link-modal"
            >
              <span>
                <i className="fa-solid fa-plus"></i> Upload Youtube Link
              </span>
            </button>
            <button
              type="button"
              className="px-3 py-1 text-white bg-spangles-700 rounded text-sm space-x-2 hover:bg-spangles-800 focus:ring-4 focus:ring-spangles-200"
              data-modal-target="files-modal"
              data-modal-toggle="files-modal"
            >
              <span>
                <i className="fa-solid fa-plus"></i> Upload Photos/Videos
              </span>
            </button>
          </div>
        </div>
        {Data && Data.length > 0 ? (
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-5">
            {Data &&
              Data.map((item, index) => (
                <div
                  key={index}
                  className="w-full h-full flex flex-col bg-transparent rounded-xl hover:shadow-xl"
                >
                  {!item.path.includes("http") &&
                  !item.path.includes(".mp4") ? (
                    <img
                      className="h-auto max-w-full rounded-lg"
                      src={`${URL}/${item.path}`}
                      alt=""
                    />
                  ) : item.path.includes("http") ? (
                    <iframe
                      src={item.path}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  ) : (
                    <ReactPlayer
                      url={`${URL}/${item.path}`}
                      controls
                      width="100%"
                      height="100%"
                    />
                  )}
                  <button
                    onClick={() => setDelete(item._id)}
                    className=" bg-slate-50 text-red-600 w-full p-4 rounded-b-xl border"
                  >
                    <i className="fa-solid fa-trash-can"></i>&nbsp; Delete
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <Spinners />
        )}
      </div>
      {Delete !== null && (
        <div
          data-modal-backdrop="static"
          tabIndex="-1"
          aria-hidden="true"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setDelete(null)}
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
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
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
                  Are you sure you want to Delete?
                </h3>
                <button
                  onClick={() => setDelete(null)}
                  type="button"
                  className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-spangles-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(Delete)}
                  type="button"
                  className="text-white ms-5 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <UploadLink setData={setData} />
      <UploadFiles setData={setData} />
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
