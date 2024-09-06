import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import ContainerWrapper from "./Pages/Container";
import JobContainer from "./Pages/Job Post/Container";
import JobList from "./Pages/Job Post/List";
import JobAddNew from "./Pages/Job Post/AddNew";
import JobPreview from "./Pages/Job Post/Preview";
import JobEdit from "./Pages/Job Post/Edit";
import BlogsContainer from "./Pages/Blogs/Container";
import BlogsAddNew from "./Pages/Blogs/AddNew";
import BlogsList from "./Pages/Blogs/List";
import BlogsEdit from "./Pages/Blogs/Edit";
import BlogsPreview from "./Pages/Blogs/Preview";
import UserAccessContainer from "./Pages/User Access/Container";
import UserAccessAddNew from "./Pages/User Access/AddNew";
import UserAccessPreview from "./Pages/User Access/Preview";
import UserAccessList from "./Pages/User Access/List";
import GalleryContainer from "./Pages/Gallery/Container";
import GalleryList from "./Pages/Gallery/List";
import ApplicantsContainer from "./Pages/Applicants/Container";
import ApplicantList from "./Pages/Applicants/List";
import ApplicantPreview from "./Pages/Applicants/Preview";
import EnquiriesContainer from "./Pages/Enquiries/Container";
import EnquiriesList from "./Pages/Enquiries/List";
import EnquiriesPreview from "./Pages/Enquiries/Preview";
import ForgotPassward from './Components/ForgotPassward'
import {OTPVerification,CreateNewPassword} from './Components/ForgotPassward'

export const URL = import.meta.env.VITE_BACKEND_API_URL;
function App() {
  const isUser = JSON.parse(window.localStorage.getItem("user"));

  useEffect(() => {
    if (isUser === null) {
      <Navigate to={"/"} />;
    }
  }, []);

  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to={`/`} />} />
          <Route path="/" element={<Login />} />
          <Route path="/ForgotPassward" element={<ForgotPassward/>} />
          <Route path="/verify" element={<OTPVerification/>} />
          <Route path="/new_password" element={<CreateNewPassword/>} />
          <Route path="admin" element={<ContainerWrapper />}>
            <Route path="user-access" element={<UserAccessContainer />}>
              <Route path="list" element={<UserAccessList />} />
              <Route path="add/new" element={<UserAccessAddNew />} />
              <Route path=":id/preview" element={<UserAccessPreview />} />
            </Route>
            <Route path="job-post" element={<JobContainer />}>
              <Route path="list" element={<JobList />} />
              <Route path="add/new" element={<JobAddNew />} />
              <Route path=":id/preview" element={<JobPreview />} />
              <Route path=":id/edit" element={<JobEdit />} />
            </Route>
            <Route path="blogs" element={<BlogsContainer />}>
              <Route path="list" element={<BlogsList />} />
              <Route path="add/new" element={<BlogsAddNew />} />
              <Route path=":id/preview" element={<BlogsPreview />} />
              <Route path=":id/edit" element={<BlogsEdit />} />
            </Route>
            <Route path="gallery" element={<GalleryContainer />}>
              <Route path="list" element={<GalleryList />} />
            </Route>
            <Route path="applicant" element={<ApplicantsContainer />}>
              <Route path="list" element={<ApplicantList />} />
              <Route path=":id/preview" element={<ApplicantPreview />} />
            </Route>
            <Route path="enquiries&messages" element={<EnquiriesContainer />}>
              <Route path="list" element={<EnquiriesList />} />
              <Route path=":id/preview" element={<EnquiriesPreview />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
