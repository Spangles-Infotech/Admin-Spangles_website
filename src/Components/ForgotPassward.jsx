import React, { useState,useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import axios from "axios";
 import { useLocation } from 'react-router-dom';
 import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
 const URL = import.meta.env.VITE_BACKEND_API_URL;
 import './forgotpassword.css'

import EyePass from './eyepass_Img/icons8-invisible-48.png'
function ForgotPassward() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseColor, setResponseColor] = useState(null);
  useEffect(() => {
    getadmin();
  }, []);
  const maskUser = (user) => {
    if (!user) return '';
    const maskedName = user.username.slice(0, 2) + "*".repeat(user.username.length - 4) + user.username.slice(-2);
    return `${maskedName}`;
  };

  const getadmin = async () => {
    try {
      const response = await axios.get(`${URL}/api/user/getAdmin_forgetpassword`);
      if (response && response.data) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const notify = (message) => toast(message);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return; // Guard clause if user is null

    const data = { username: user.username };

    try {
      const response = await axios.post(`${URL}/api/user/forget_password`, data);
      const result = response.data;

      if (result.message) {
        setResponseColor("text-green-600");
        setResponseMessage(result.message);
        // notify(result.message);
        setTimeout(() => {
          navigate("/verify", { state: { username: user.username, email: user.email } });
        }, 0);
      }
    } catch (error) {
      setResponseColor("text-red-600");
      setResponseMessage(
        error.response ? error.response.data: error.message
      );
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      {user ? (
        <section className="bg-[url('./assets/login-bg-min.png')] bg-cover bg-center bg-no-repeat bg-spangles-800 w-screen h-screen flex-col flex items-center justify-center">
          <div className="w-full max-w-xs p-8 bg-white border border-gray-200 shadow 2xl:max-w-lg lg:max-w-sm xl:max-w-md lg:p-10 xl:p-12 rounded-3xl sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form
              className="space-y-6 lg:space-y-8 xl:space-y-10 2xl:space-y-12"
              onSubmit={handleSubmit}
            >
              <h5 className="text-xl font-bold text-center text-spangles-900 dark:text-white">
                Password assistance
              </h5>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-spangles-500 focus:outline-none focus:ring-0 focus:border-spangles-600 peer"
                  placeholder=" "
                  value={maskUser(user)}
                  readOnly
                />
                <label
                  htmlFor="username"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-spangles-600 peer-focus:dark:text-spangles-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Username
                </label>
              </div>
              {responseMessage && (
              <p className={`text-center font-semibold ${responseColor}`}>
                {responseMessage}
              </p>
            )}
              <button
                type="submit"
                className="w-full text-white bg-spangles-700 hover:bg-spangles-800 focus:ring-4 focus:outline-none focus:ring-spangles-300 font-medium rounded-lg text-base px-5 py-2.5 text-center dark:bg-spangles-600 dark:hover:bg-spangles-700 dark:focus:ring-spangles-800"
              >
                Continue
              </button>
            </form>
          </div>
        </section>
      ) : null}
    </React.Fragment>
  );
}

export default ForgotPassward;


export const OTPVerification = () => {
  const notify = (users) => toast(users);

  let { state } = useLocation();
  const { username } = state;
  const mail = state.email;

  const [otp, setOtp] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [responseColor, setResponseColor] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState(mail); 
  const navigate = useNavigate();

  // Mask email to show first 2 and last 2 characters of the local part
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    const maskedName = name.slice(0, 2) + "*".repeat(name.length - 4) + name.slice(-2);
    return `${maskedName}@${domain}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
// const username=username
// console.log(userId);
    try {
      const response = await axios.post(`${URL}/api/user/verify-otp`, {username ,otp });
      if (response && response.data==='OTP verified.') {
        setResponseColor("text-green-600");
        setResponseMessage(response.data);
setTimeout(() => {
    navigate("/new_password", { state: { username:username} });

      }, 500);
    }

     

    } catch (error) {
      console.log(error);
      
      setResponseColor("text-red-600");
      setResponseMessage(
        error.response ? error.response.data: error.message
      );
    }
  };

  const handleResendOTP = async () => {
    const data = { username };
    const response = await axios.post(`${URL}/api/user/forget_password`, data);
    const users = response.data;
    if (users.message) {
      
      // notify(users.message);
      setIsResending(true);
    }
    setTimeout(() => {
      setIsResending(false);
      setResponseMessage("OTP Resent successfully!");
      setResponseColor("text-green-600");
    }, 2000);
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <section className="bg-[url('./assets/login-bg-min.png')] bg-cover bg-center bg-no-repeat bg-spangles-800 w-screen h-screen flex-col flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-md">
          <h5 className="mt-4 text-2xl font-bold text-center text-spangles-900">
            Authentication required
          </h5>
          <p className="text-center text-gray-600">
            {maskEmail(email)}
          </p>
          <p className="mb-6 text-center text-gray-600">
            We’ve sent a One Time Password (OTP) to the Email Adress above.
            Please enter it to complete verification.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label
                htmlFor="otp"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Enter OTP
              </label>
              <input
                type="number"
                name="otp"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{
                  appearance: 'textfield',
                  MozAppearance: 'textfield',
                  WebkitAppearance: 'none',
                  margin: 0,
                }}
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                placeholder="Enter OTP"
                required
              />
            </div>
            {responseMessage && (
              <p className={`text-center font-semibold ${responseColor}`}>
                {responseMessage}
              </p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300"
            >
              Verify
            </button>
          </form>
          <div className="flex justify-between mt-4">
            <span
              className="text-sm text-gray-900 cursor-pointer"
              onClick={handleResendOTP}
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </span>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};




export const  CreateNewPassword=()=>{

  let { state } = useLocation();

  
  const { username } = state;




  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseColor, setResponseColor] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setResponseColor("text-red-600");
      setResponseMessage("Passwords do not match");
      return;
    }

    try {
      // Send the password to your backend for saving
      const response = await axios.post(`${URL}/api/user/reset-password`, {username, newPassword });
      if (response &&response.data==='Password Updated Successfully.') {
        setResponseMessage(response.data);
      setResponseColor("text-green-600");
      setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      }
     
    } catch (error) {
      setResponseColor("text-red-600");
      setResponseMessage(error.response ? error.response.data : error.message);
    }
  };

  return (
    <section className="bg-[url('./assets/login-bg-min.png')] bg-cover bg-center bg-no-repeat bg-spangles-800 w-screen h-screen flex-col flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white border border-gray-300 rounded-lg shadow-md">
      
        <h5 className="mt-4 text-2xl font-bold text-center text- text-spangles-900">
          Create New Password
        </h5>
        <br/>
        <p className="mb-6 text-center text-gray-600">
          We’ll ask for this password whenever you sign in.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="newPassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-spangles-500 focus:border-spangles-500"
                placeholder="New Password"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-600 cursor-pointer right-3 top-2"
              >
                {showPassword ? <img className=" EyePass"  src={EyePass} alt="invisible"/> : "👁️"}
              </span>
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Re-enter New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-spangles-500 focus:border-spangles-500"
                placeholder="Re-enter New Password"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute text-gray-600 cursor-pointer right-3 top-2"
              >
                {showConfirmPassword ? <img className=" EyePass"  src={EyePass} alt="invisible"/> : "👁️"}
              </span>
            </div>
          </div>

          {responseMessage && (
            <p className={`text-center font-semibold ${responseColor}`}>
              {responseMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white rounded-lg bg-spangles-900 hover:bg-spangles-700 focus:ring-4 focus:outline-none focus:ring-spangles-600"
          >
            Save Changes and Sign in
          </button>
        </form>
      </div>
    </section>
  );
}

