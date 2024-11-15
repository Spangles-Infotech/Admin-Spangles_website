import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { URL } from "../../App";
import axios from "axios";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import { Tag } from "../../Components/Tag";

function AddNew() {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const params = useParams();
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  const [Data, setData] = useState({});
  const [Files, setFiles] = useState([]);
  const [FileSrc, setFileSrc] = useState("");
  const [value, setValue] = useState("");
  const [altTag, setAltTag] = useState([]);
  const [altInput, setAltInput] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [keyWord, setKeyWord] = useState([]);
  const [metaDescription, setMetaDescription] = useState("");

  useEffect(() => {
    fetchData();
  }, [params]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${URL}/api/blog/${params.id}/data`, {
        headers: {
          Authorization: token,
        },
      });
      setData({ ...response.data.blogs });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      ...Data,
      content: value,
      files: Files.length !== 0 ? Files[0] : Data && Data.image,
    };
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    try {
      const response = await axios.put(
        `${URL}/api/blog/${params.id}/update`,
        formData,
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
    accept: {
      "image/*": [".jpeg", ".png", ".jpeg"],
    },
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

  useEffect(() => {
    if (
      Files.length === 0 &&
      Data &&
      Data.image !== "" &&
      Data &&
      Data.image !== undefined &&
      Data &&
      Data.image !== null
    ) {
      setFileSrc(`${URL}/${Data && Data.image}`);
    }
    setValue(Data.content);
    setKeyWord(Data.keyWord)
    setAltTag(Data.altTag)
    setMetaDescription(Data.metaDescription)
  }, [Data]);

  useEffect(()=>{
    const handleKeyDown = (e)=>{
      if(e.key === "Enter"){
        if(altInput !== ""){
          setAltTag((prev)=>([...prev, altInput]))
          setAltInput("")
        }else{
          setKeyWord((prev)=> ([...prev, inputValue]))
          setInputValue("")
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  },[inputValue, altInput])

  console.log("data", Data)

  return (
    <React.Fragment>
      <div className="flex flex-col bg-white p-5 space-y-10 rounded-t-lg">
        <h1 className="font-semibold text-lg text-spangles-700">
          Update Blog Details
        </h1>
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
                onChange={(ev) => setData({ ...Data, title: ev.target.value })}
                value={Data && Data.title}
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
                onChange={(ev) => setValue(ev)}
                modules={modules}
              />
            </div>
            <div className="sm:col-span-2 flex items-start gap-20">
              <div className="max-w-sm">
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
                      : "Drop your images here, or click to select files"}
                  </p>
                  <p className="text-xs">
                    (Only *.jpeg, *.png, files will be accepted)
                  </p>
                </div>
              </div>
              <div className="w-full">
                <img src={FileSrc} alt="" className="w-64 h-64" />
              </div>
            </div>
            <div className={`flex flex-col gap-2 transition-all duration-500 ease-in-out ${keyWord?.length > 0 ? "h-[120px]" : "h-[80px]"}}`}>
              <label>Image Alt Tag</label>
              <input
                value={altInput}
                onChange={(e) => setAltInput(e.target.value)}
                placeholder="Image Alt Tag"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
              <Tag keyWord={altTag} setFunction={setAltTag}/>
            </div>
            <div className={`flex flex-col gap-2 transition-all duration-500 ease-in-out ${keyWord?.length > 0 ? "h-[120px]" : "h-[80px]"}}`}>
              <label>Key Words</label>
              <input
                value={inputValue}
                placeholder="Key Words"
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
              <Tag keyWord={keyWord} setFunction={setKeyWord}/>
            </div>

            <div className="flex flex-col gap-2">
              <label>Meta Description</label>
              <input
                value={metaDescription}
                placeholder="Meta Description"
                onChange={(e) => setMetaDescription(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
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
              disabled={value === "" || Files.length === 0 || altTag?.length === 0 || keyWord?.length === 0 || metaDescription === ""}
              type="submit"
              className="inline-flex items-center disabled:bg-spangles-400 px-14 py-2.5 mt-4 sm:mt-6 text-base font-semibold text-center text-white bg-spangles-700 rounded-lg focus:ring-4 hover:bg-spangles-800  focus:ring-spangles-200"
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
