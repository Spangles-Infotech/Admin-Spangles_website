import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { URL } from "../../App";
import axios from "axios";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import { initFlowbite } from "flowbite";

function Edit() {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const params = useParams();
  const [Data, setData] = useState({
    _id: "",
    category: "",
    designation: "",
    location: "",
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
    initFlowbite();
    fetchData();
  }, []);

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
  const [Category, setCategory] = useState("");
  const [Location, setLocation] = useState("");
  const [Designation, setDesignation] = useState("");
  const [WorkExperience, setWorkExperience] = useState({
    from: "",
    to: "",
  });
  const [CategoryList, setCategoryList] = useState([]);
  const [RecruiterMail, setRecruiterMail] = useState("");
  const [JobSummary, setJobSummary] = useState("");
  const [PreferredSkills, setPreferredSkills] = useState("");
  const [ResAndDuties, setResAndDuties] = useState("");
  const [ExpAndQualification, setExpAndQualification] = useState("");
  const [PreferredSkillsList, setPreferredSkillsList] = useState([]);
  const [ResAndDutiesList, setResAndDutiesList] = useState([]);
  const [ExpAndQualificationList, setExpAndQualificationList] = useState([]);
  const [Status, setStatus] = useState("");

  useEffect(() => {
    setCategory(Data.category);
    setDesignation(Data.designation);
    setLocation(Data.location);
    setWorkExperience({
      from:
        Data.work_experience === "Fresher"
          ? "0"
          : Data.work_experience.split(" ")[0],
      to:
        Data.work_experience === "Fresher"
          ? "0"
          : Data.work_experience.split(" ")[2],
    });
    setRecruiterMail(Data.RecruiterMail);
    setJobSummary(Data.job_summary);
    setPreferredSkillsList(Data.preferred_skills);
    setResAndDutiesList(Data.responsibilities_and_duties);
    setExpAndQualificationList(Data.required_experience_and_qualifications);
    setStatus(Data.status);
  }, [Data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      category: Category,
      designation: Designation,
      location: Location,
      work_experience:
        WorkExperience.from == 0 && WorkExperience.to == 0
          ? "Fresher"
          : WorkExperience.from + " - " + WorkExperience.to + " years",
      RecruiterMail: RecruiterMail,
      job_summary: JobSummary,
      preferred_skills: PreferredSkillsList,
      responsibilities_and_duties: ResAndDutiesList,
      required_experience_and_qualifications: ExpAndQualificationList,
      status: Status,
    };
    try {
      const response = await axios.put(
        `${URL}/api/job/${params.id}/update`,
        data,
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
        navigate(`/admin/job-post/${params.id}/preview`);
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
  const handleAdd = () => {
    if (!CategoryList.includes(Category)) {
      setCategoryList((previous) => [...previous, Category]);
    }
    setCategory("");
  };
  return (
    <React.Fragment>
      <div className="flex flex-col bg-white p-5 space-y-10 rounded-t-lg">
        <h1 className="font-semibold text-lg text-spangles-700">
          Update Job Details
        </h1>
        <form onSubmit={handleSubmit} className="space-y-36">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="w-full">
              <div className="w-full inline-flex justify-between items-center">
                <label
                  htmlFor="category"
                  className="block mb-2 font-medium text-gray-900 dark:text-white"
                >
                  Category
                </label>
                <button
                  data-modal-target="category-modal"
                  data-modal-toggle="category-modal"
                  class="block text-spangles-600 text-xs font-medium underline"
                  type="button"
                >
                  Add Category
                </button>
              </div>
              <select
                id="category"
                name="category"
                required
                onChange={(e) => setCategory(e.target.value)}
                value={Category}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              >
                {CategoryList &&
                  CategoryList.map((category, index) => (
                    <option value={category} key={index}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
            <div className="w-full">
              <div className="w-full inline-flex justify-between items-center mb-2">
                <label
                  htmlFor="designation"
                  className="block font-medium text-gray-900 dark:text-white"
                >
                  Designation
                </label>
                <p className="text-red-600 text-xs"></p>
              </div>
              <input
                type="text"
                name="designation"
                id="designation"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                placeholder=""
                required
                onChange={(e) => setDesignation(e.target.value)}
                value={Designation}
                data-popover-target="designation-popover-hover"
                data-popover-trigger="hover"
              />
              <div
                data-popover
                id="designation-popover-hover"
                role="tooltip"
                className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
              >
                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Field Instruction
                  </h3>
                </div>
                <div className="px-3 py-2">
                  <p>
                    Double-check your spelling for accuracy before typing to
                    ensure error-free input.
                  </p>
                </div>
                <div data-popper-arrow></div>
              </div>
            </div>
            <div className="w-full">
              <label
                htmlFor="work_experience"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Work Experience &nbsp;
                <span className="text-[10px] text-gray-600">(in years)</span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <input
                  type="number"
                  name="work_experience_from"
                  id="work_experience_from"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                  placeholder=""
                  required
                  onChange={(e) =>
                    setWorkExperience({
                      from: e.target.value,
                      to: WorkExperience.to,
                    })
                  }
                  value={WorkExperience.from}
                  min={0}
                  max={15}
                />
                <input
                  type="number"
                  name="work_experience_to"
                  id="work_experience_to"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                  placeholder=""
                  required
                  onChange={(e) =>
                    setWorkExperience({
                      from: WorkExperience.from,
                      to: e.target.value,
                    })
                  }
                  value={WorkExperience.to}
                  min={0}
                  max={15}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="w-full inline-flex justify-between items-center mb-2">
                <label
                  htmlFor="location"
                  className="block font-medium text-gray-900 dark:text-white"
                >
                  Location
                </label>
                <p className="text-red-600 text-xs"></p>
              </div>
              <input
                type="text"
                name="location"
                id="location"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                placeholder=""
                required
                onChange={(e) => setLocation(e.target.value)}
                value={Location}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="job_summary"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Job Summary
              </label>
              <textarea
                id="job_summary"
                name="job_summary"
                rows="3"
                className="block p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                placeholder="Enter Job Summary here"
                required
                onChange={(e) => setJobSummary(e.target.value)}
                value={JobSummary}
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="preferred_skills"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Preferred Skills
              </label>
              <div className="relative">
                <input
                  id="preferred_skills"
                  name="preferred_skills"
                  onChange={(event) => setPreferredSkills(event.target.value)}
                  className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-spangles-500 focus:border-spangles-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-500 dark:focus:border-spangles-500"
                  placeholder="Enter Preferred Skills"
                  value={PreferredSkills}
                  required={PreferredSkillsList.length === 0}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (PreferredSkills !== "") {
                      setPreferredSkillsList((prev) => [
                        ...prev,
                        PreferredSkills.trim(),
                      ]);
                      setPreferredSkills("");
                    }
                  }}
                  className="text-white absolute end-2.5 bottom-2.5 bg-spangles-700 hover:bg-spangles-800 focus:ring-4 focus:outline-none focus:ring-spangles-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-spangles-600 dark:hover:bg-spangles-700 dark:focus:ring-spangles-800"
                >
                  Add
                </button>
              </div>
            </div>
            {PreferredSkillsList.length > 0 && (
              <div className="">
                <ul className="inline-flex flex-wrap items-center gap-2">
                  {PreferredSkillsList.map((elem, idx) => (
                    <li
                      key={idx}
                      className="px-2 py-1 border border-spangles-600 rounded-md inline-flex items-center gap-2 text-sm"
                    >
                      {elem}&nbsp;
                      <i
                        className="fa-solid fa-xmark text-xs hover:cursor-pointer hover:text-red-600"
                        onClick={() => {
                          const update = [...PreferredSkillsList];
                          update.splice(idx, 1);
                          setPreferredSkillsList(update);
                        }}
                      ></i>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="sm:col-span-2">
              <label
                htmlFor="responsibilities_and_duties"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Responsibilities and Duties
              </label>
              <div className="relative">
                <input
                  id="responsibilities_and_duties"
                  name="responsibilities_and_duties"
                  onChange={(event) => setResAndDuties(event.target.value)}
                  className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-spangles-500 focus:border-spangles-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-500 dark:focus:border-spangles-500"
                  placeholder="Enter Responsibilities and Duties"
                  value={ResAndDuties}
                  required={ResAndDuties.length === 0}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (ResAndDuties !== "") {
                      setResAndDutiesList((prev) => [
                        ...prev,
                        ResAndDuties.trim(),
                      ]);
                      setResAndDuties("");
                    }
                  }}
                  className="text-white absolute end-2.5 bottom-2.5 bg-spangles-700 hover:bg-spangles-800 focus:ring-4 focus:outline-none focus:ring-spangles-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-spangles-600 dark:hover:bg-spangles-700 dark:focus:ring-spangles-800"
                >
                  Add
                </button>
              </div>
            </div>
            {ResAndDutiesList.length > 0 && (
              <div className="">
                <ul className="list-disc border rounded p-3 space-y-2">
                  {ResAndDutiesList.map((elem, idx) => (
                    <li key={idx} className="text-sm ms-5">
                      {elem}&nbsp;
                      <i
                        className="fa-solid fa-xmark text-xs hover:cursor-pointer hover:text-red-600 ms-5"
                        onClick={() => {
                          const update = [...ResAndDutiesList];
                          update.splice(idx, 1);
                          setResAndDutiesList(update);
                        }}
                      ></i>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="sm:col-span-2">
              <label
                htmlFor="experience_and_qualifications"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Required Experience and Qualifications
              </label>
              <div className="relative">
                <input
                  id="experience_and_qualifications"
                  name="experience_and_qualifications"
                  onChange={(event) =>
                    setExpAndQualification(event.target.value)
                  }
                  className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-spangles-500 focus:border-spangles-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-spangles-500 dark:focus:border-spangles-500"
                  placeholder="Enter Experience and Qualifications"
                  value={ExpAndQualification}
                  required={ExpAndQualificationList.length === 0}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (ExpAndQualification !== "") {
                      setExpAndQualificationList((prev) => [
                        ...prev,
                        ExpAndQualification.trim(),
                      ]);
                      setExpAndQualification("");
                    }
                  }}
                  className="text-white absolute end-2.5 bottom-2.5 bg-spangles-700 hover:bg-spangles-800 focus:ring-4 focus:outline-none focus:ring-spangles-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-spangles-600 dark:hover:bg-spangles-700 dark:focus:ring-spangles-800"
                >
                  Add
                </button>
              </div>
            </div>
            {ExpAndQualificationList.length > 0 && (
              <div className="">
                <ul className="list-disc border rounded p-3 space-y-2">
                  {ExpAndQualificationList.map((elem, idx) => (
                    <li key={idx} className="text-sm ms-5">
                      {elem}&nbsp;
                      <i
                        className="fa-solid fa-xmark text-xs hover:cursor-pointer hover:text-red-600 ms-5"
                        onClick={() => {
                          const update = [...ExpAndQualificationList];
                          update.splice(idx, 1);
                          setExpAndQualificationList(update);
                        }}
                      ></i>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="sm:col-span-2">
              <div className="inline-flex items-center space-x-20">
                <h6 className="block font-medium text-gray-900 dark:text-white">
                  Status
                </h6>
                <ul className="w-full inline-flex items-center space-x-20 text-sm font-medium text-gray-900 bg-white border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <li className="">
                    <div className="flex items-center">
                      <input
                        id="active_button"
                        type="radio"
                        value="Active"
                        onChange={() => setStatus("Active")}
                        name="active_button"
                        checked={Status === "Active" ? true : false}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-green-600 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="active_button"
                        className="w-full py-3 ms-2 text-sm font-medium text-green-600 dark:text-gray-300"
                      >
                        Active
                      </label>
                    </div>
                  </li>
                  <li className="">
                    <div className="flex items-center">
                      <input
                        id="on_hold_button"
                        type="radio"
                        value="On Hold"
                        onChange={() => setStatus("On Hold")}
                        name="on_hold_button"
                        checked={Status === "On Hold" ? true : false}
                        className="w-4 h-4 text-orange-500 bg-gray-100 border-orange-500 focus:ring-orange-500 dark:focus:ring-orange-500 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-500 dark:border-gray-500"
                      />
                      <label
                        htmlFor="on_hold_button"
                        className="w-full py-3 ms-2 text-sm font-medium text-orange-500 dark:text-gray-300"
                      >
                        On Hold
                      </label>
                    </div>
                  </li>
                  <li className="">
                    <div className="flex items-center">
                      <input
                        id="in_active_button"
                        type="radio"
                        value="Inactive"
                        onChange={() => setStatus("Inactive")}
                        checked={Status === "Inactive" ? true : false}
                        name="in_active_button"
                        className="w-4 h-4 text-red-600 bg-gray-100 border-red-600 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="in_active_button"
                        className="w-full py-3 ms-2 text-sm font-medium text-red-600 dark:text-gray-300"
                      >
                        Inactive
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-end space-x-5">
            <Link
              to={`/admin/job-post/${params.id}/preview`}
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-base font-semibold text-center text-red-600 rounded-lg focus:ring-2 hover:text-red-700 focus:ring-red-200"
            >
              Discard
            </Link>
            <button
              type="submit"
              className="inline-flex items-center px-14 py-2.5 mt-4 sm:mt-6 text-base font-semibold text-center text-white bg-spangles-700 rounded-lg focus:ring-4 hover:bg-spangles-800  focus:ring-spangles-200"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
      <div
        id="category-modal"
        tabindex="-1"
        aria-hidden="true"
        class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div class="relative p-4 w-full max-w-xl max-h-full">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                New Category
              </h3>
              <button
                type="button"
                class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="category-modal"
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div class="p-4 md:p-5">
              <div class="space-y-4">
                <div>
                  <input
                    type="text"
                    name="new_category"
                    id="new_category"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder=""
                    required
                    onChange={(e) => setCategory(e.target.value)}
                    value={Category}
                    data-popover-target="category-popover-hover"
                    data-popover-trigger="hover"
                  />
                </div>
                <button
                  type="button"
                  disabled={Category === ""}
                  onClick={() => handleAdd()}
                  class="w-fit text-white bg-spangles-700 disabled:bg-spangles-500 hover:bg-spangles-800 focus:ring-4 focus:outline-none focus:ring-spangles-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-spangles-600 dark:hover:bg-spangles-700 dark:focus:ring-spangles-800"
                  data-modal-hide="category-modal"
                >
                  Save
                </button>
              </div>
              <div
                data-popover
                id="category-popover-hover"
                role="tooltip"
                className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
              >
                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Field Instruction
                  </h3>
                </div>
                <div className="px-3 py-2">
                  <p>
                    Double-check your spelling for accuracy before typing to
                    ensure error-free input.
                  </p>
                </div>
                <div data-popper-arrow></div>
              </div>
            </div>
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
    </React.Fragment>
  );
}

export default Edit;
