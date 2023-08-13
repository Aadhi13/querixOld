import { Routes, Route } from "react-router-dom";

import Signup from "../pages/user/SignupPage";
import Layout from "../pages/user/Layout";
import OtpVerify from "../pages/user/OtpVerifyPage";
import Signin from "../pages/user/SigninPage";
import Home from "../pages/user/HomePage";
import Question from "../pages/user/QuestoinPage";
import ForgotPassword from "../pages/user/FogotPasswordPage";
import Account from "../pages/user/AccountPage";

import '../assets/styles/user.css';

import IsAuthenticated from "../utils/user/IsAuthenticated";
import NotFound from "../pages/Error/NotFound";

function UserRoutes() {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route path="otp-verify" element={<OtpVerify />} />
        <Route path="signin" element={<IsAuthenticated><Signin /></IsAuthenticated>} />
        <Route path="question/:id" element={<Question />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="account" element={<IsAuthenticated><Account /></IsAuthenticated>} />
        <Route path="*" element={<NotFound />} />
      </Route >
    </Routes>
  )
}

export default UserRoutes;