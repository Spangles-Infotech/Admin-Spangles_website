import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { URL } from "../App";
import { FailedMessage, SuccessMessage } from "./ToastMessage";
import ReactPlayer from "react-player";

function UploadFiles({ setData }) {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [FileSrc, setFileSrc] = useState("");
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    //
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      const response = await axios.post(
        `${URL}/api/gallery/files/add/new`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setData(response.data.galleryData);
      setResponse({
        status: "Success",
        message: "Uploaded Successfully.",
      });
      const close = document.getElementById("files-modal-btn");
      setTimeout(() => {
        close.click();
        setResponse({
          status: null,
          message: "",
        });
      }, 5000);
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        setResponse({
          status: "Failed",
          message: error.response.data.message,
        });
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 5000);
      }
      if (error.response.status === 500) {
        setResponse({
          status: "Failed",
          message: error.response.data.message,
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

  useEffect(() => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setFileSrc(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Error: ", error);
      };
    }
  }, [files]);

  return (
    <React.Fragment>
      {/* <!-- Modal toggle --> */}
      {/* <button
        data-modal-target="files-modal"
        data-modal-toggle="files-modal"
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Toggle modal
      </button> */}

      {/* <!-- Main modal --> */}
      <div
        id="files-modal"
        data-modal-backdrop="static"
        tabIndex="-1"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-40 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          {/* <!-- Modal content --> */}
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-lg shadow dark:bg-gray-700"
          >
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upload File
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="files-modal"
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
            {/* <!-- Modal body --> */}
            <div className="p-8 md:p-10 mb-10 space-y-10">
              <h1 className="text-xl font-semibold mb-5">
                Drag and Drop File Upload
              </h1>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-spangles-500 rounded p-20 text-center cursor-pointer ${
                  isDragActive ? "bg-spangles-100" : ""
                }`}
              >
                <input {...getInputProps({ multiple: false })} />
                <p className="m-0 text-base font-medium">
                  {isDragActive
                    ? "Drop the files here..."
                    : "Drop your images/videos here, or click to select files"}
                </p>
              </div>
              <div className="w-full">
                {files.length > 0 ? (
                  files[0].type.includes("image") ? (
                    <img src={FileSrc} alt="" className="w-20 h-20" />
                  ) : (
                    <ReactPlayer
                      url={FileSrc}
                      controls
                      width="100%"
                      height="100%"
                    />
                  )
                ) : null}
              </div>
            </div>
            {/* <!-- Modal footer --> */}
            <div className="flex justify-end items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                id="files-modal-btn"
                data-modal-hide="files-modal"
                type="button"
                className="py-2.5 px-5 text-sm font-medium focus:outline-none bg-white rounded-lg text-red-700 focus:z-10 focus:ring-2 focus:ring-red-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Discard
              </button>
              <button
                disabled={files.length === 0}
                type="submit"
                className="text-white ms-3 disabled:bg-opacity-70 bg-spangles-700 hover:bg-spangles-800 focus:ring-4 focus:outline-none focus:ring-spangles-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center dark:bg-spangles-600 dark:hover:bg-spangles-700 dark:focus:ring-spangles-800"
              >
                Upload
              </button>
            </div>
          </form>
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

export default UploadFiles;
