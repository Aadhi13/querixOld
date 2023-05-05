import { Routes, Route } from "react-router-dom";

import Signup from "../pages/user/SignupPage";
import Layout from "../pages/user/Layout";
import OtpVerify from "../pages/user/OtpVerifyPage";
import Signin from "../pages/user/SigninPage";
import Home from "../pages/user/HomePage";

import '../assets/styles/user.css';

import AuthenticatedRoute from "../utils/AuthenticatedRoute";

function UserRoutes() {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route path="otp-verify" element={<OtpVerify />} />
        <Route path="signin" element={<Signin />} />
      </Route >
    </Routes>
  )
}

export default UserRoutes;