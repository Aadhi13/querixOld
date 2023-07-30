import { Routes, Route } from "react-router-dom";

import Signin from "../pages/admin/AdminSigninPage";
import NotFound from "../pages/Error/NotFound";
import Layout from "../pages/admin/Layout";
import Dashboard from "../pages/admin/AdminDashboardPage";
import IsAuthenticated from "../utils/admin/IsAuthenticated";
import UserManage from "../pages/admin/AdminUserManagePage";
import QuestionManage from "../pages/admin/AdminQuestionManagePage";


function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route index element={<IsAuthenticated><Dashboard /></IsAuthenticated>} />
        <Route path="signin" element={<IsAuthenticated><Signin /></IsAuthenticated>} />
        <Route path="user-manage" element={<IsAuthenticated><UserManage /></IsAuthenticated>} />
        <Route path="question-manage" element={<IsAuthenticated><QuestionManage /></IsAuthenticated>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes