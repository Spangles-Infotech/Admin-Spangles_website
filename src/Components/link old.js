import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../App";
import { FailedMessage, SuccessMessage } from "./ToastMessage";

function UploadLink({ setData }) {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  const [EmbedLink, setEmbedLink] = useState("");
  const [Video, setVideo] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      path: EmbedLink,
    };
    try {
      const close = document.getElementById("link-modal-btn");
      close.click();
      const response = await axios.post(
        `${URL}/api/gallery/link/add/new`,
        data,
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

      setTimeout(() => {
        setResponse({
          status: null,
          message: "",
        });
        setEmbedLink("");
        setVideo(false);
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
  return (
    <React.Fragment>
      {/* <!-- Modal toggle --> */}
      {/* <button
        data-modal-target="link-modal"
        data-modal-toggle="link-modal"
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Toggle modal
      </button> */}

      {/* <!-- Main modal --> */}
      <div
        id="link-modal"
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
                Youtube Link
              </h3>
              <button
                onClick={() => {
                  setEmbedLink("");
                  setVideo(false);
                }}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="link-modal"
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
            <div className="w-full p-8 md:p-10 space-y-10 mb-10">
              <div className="">
                <label
                  htmlFor="youtube_link"
                  className="block mb-2 font-medium text-gray-900 dark:text-white"
                >
                  Embed Link
                </label>
                <input
                  type="url"
                  id="youtube_link"
                  name="youtube_link"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder=""
                  onChange={(ev) => {
                    setEmbedLink(ev.target.value);
                    setVideo(false);
                  }}
                  value={EmbedLink}
                  required
                />
              </div>
              <div className="w-full flex flex-col items-center">
                {Video && EmbedLink !== "" ? (
                  <iframe
                    src={EmbedLink}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-64 rounded-xl"
                  ></iframe>
                ) : EmbedLink.includes("https://www.youtube.com/embed/") ? (
                  <button
                    type="button"
                    onClick={() => setVideo(true)}
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-8 py-1 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  >
                    Play
                  </button>
                ) : (
                  EmbedLink !== "" && (
                    <div className="font-medium text-red-600">Please given right embed link</div>
                  )
                )}
              </div>
            </div>
            {/* <!-- Modal footer --> */}
            <div className="flex justify-end items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                onClick={() => {
                  setEmbedLink("");
                  setVideo(false);
                }}
                id="link-modal-btn"
                data-modal-hide="link-modal"
                type="button"
                className="py-2.5 px-5 text-sm font-medium focus:outline-none bg-white rounded-lg text-red-700 focus:z-10 focus:ring-2 focus:ring-red-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Discard
              </button>
              <button
                // data-modal-hide="link-modal"
                type="submit"
                className="text-white ms-3 bg-spangles-700 hover:bg-spangles-800 focus:ring-4 focus:outline-none focus:ring-spangles-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center dark:bg-spangles-600 dark:hover:bg-spangles-700 dark:focus:ring-spangles-800"
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

export default UploadLink;
