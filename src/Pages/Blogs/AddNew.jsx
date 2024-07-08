import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { URL } from "../../App";
import axios from "axios";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";

function AddNew() {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  const [Files, setFiles] = useState([]);
  const [FileSrc, setFileSrc] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      title: event.target.title.value,
      content: value,
      files: Files[0],
      posted_on: new Date(),
    };
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    try {
      const response = await axios.post(`${URL}/api/blogs/add/new`, formData, {
        headers: {
          Authorization: token,
        },
      });
      setResponse({
        status: "Success",
        message: response.data.message,
      });
      setTimeout(() => {
        navigate("/admin/blogs/list");
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
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }, { size: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });
  useEffect(() => {
    if (Files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(Files[0]);
      reader.onloadend = () => {
        setFileSrc(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Error: ", error);
      };
    }
  }, [Files]);

  return (
    <React.Fragment>
      <div className="flex flex-col bg-white p-5 space-y-10 rounded-t-lg">
        <h1 className="font-semibold text-lg text-spangles-700">New Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-20">
          <div className="flex flex-col space-y-8">
            <div className="w-full">
              <label
                htmlFor="title"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder=""
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="content"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Content
              </label>
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                modules={modules}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col sm:flex-row items-start gap-8">
              <div className="w-full sm:w-auto">
                <label
                  htmlFor="upload_image"
                  className="block mb-5 font-medium text-gray-900 dark:text-white"
                >
                  Upload Image
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed border-spangles-500 rounded p-16 text-center cursor-pointer ${
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
              </div>
              <div className="w-full sm:w-auto">
                {Files.length > 0 && (
                  <img
                    src={FileSrc}
                    alt=""
                    className="w-64 h-64 object-cover"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-end space-x-5">
            <Link
              to="/admin/blogs/list"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-base font-semibold text-center text-red-600 rounded-lg focus:ring-2 hover:text-red-700 focus:ring-red-200"
            >
              Discard
            </Link>
            <button
              type="submit"
              className="inline-flex items-center px-14 py-2.5 mt-4 sm:mt-6 text-base font-semibold text-center text-white bg-spangles-700 rounded-lg focus:ring-4 hover:bg-spangles-800 focus:ring-spangles-200"
            >
              Upload
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

export default AddNew;
