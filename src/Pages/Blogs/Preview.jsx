import axios from "axios";
import HtmlParser from "html-react-parser";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { URL } from "../../App";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";

function Preview() {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const params = useParams();
  const [Data, setData] = useState({});
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
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
      setData(response.data.blogs);
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
      <div className="w-full flex flex-col bg-white p-5 mb-20 space-y-10 rounded-t-lg">
        <Link to={"/admin/blogs/list"}>
          <i className="fa-solid fa-arrow-left-long text-2xl"></i>
        </Link>
        <h6 className="mt-2 text-3xl font-bold tracking-tight text-spangles-700 dark:text-white">
          {Data.title}
        </h6>
        <p className="mt-5 font-normal text-gray-700 dark:text-gray-400">
          <i className="fa-regular fa-clock"></i>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {new Date(Data.posted_on).toUTCString()}
        </p>
        <img
          className="object-contain w-full rounded-t-lg h-96 md:rounded-none"
          src={`${URL}/${Data.image}`}
          alt=""
        />
        <div className="w-full text-justify">
          {HtmlParser(`${Data && Data.content}`)}
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
