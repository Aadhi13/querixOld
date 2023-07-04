import { Routes, Route } from "react-router-dom";

import Signup from "../pages/user/SignupPage";
import Layout from "../pages/user/Layout";
import OtpVerify from "../pages/user/OtpVerifyPage";
import Signin from "../pages/user/SigninPage";
import Home from "../pages/user/HomePage";
import Question from "../pages/user/QuestoinPage";
import ForgotPassword from "../pages/user/FogotPasswordPage";


import '../assets/styles/user.css';

import AuthenticatedRoute from "../utils/AuthenticatedRoute";
import NotFound from "../pages/Error/NotFound";

function UserRoutes() {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route path="otp-verify" element={<OtpVerify />} />
        <Route path="signin" element={<Signin />} />
        <Route path="question/:id" element={<Question />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route >
    </Routes>
  )
}

export default UserRoutes;