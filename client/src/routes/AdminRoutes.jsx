import { Routes, Route } from "react-router-dom";

import Signin from "../pages/admin/AdminSigninPage";
import NotFound from "../pages/Error/NotFound";
import Layout from "../pages/admin/Layout";
import Dashboard from "../pages/admin/AdminDashboardPage";
import IsAuthenticated from "../utils/admin/IsAuthenticated";
import UserManage from "../pages/admin/AdminUserManagePage";
import QuestionManage from "../pages/admin/AdminQuestionManagePage";
import ReportedQuestionManage from "../pages/admin/AdminReportedQuestionManagePage";
import ReportedAnswerManage from "../pages/admin/AdminReportedAnswerManagePage";
import ReportedCommentManage from "../pages/admin/AdminReportedCommentManagePage";

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route index element={<IsAuthenticated><Dashboard /></IsAuthenticated>} />
        <Route path="signin" element={<IsAuthenticated><Signin /></IsAuthenticated>} />
        <Route path="user-manage" element={<IsAuthenticated><UserManage /></IsAuthenticated>} />
        <Route path="question-manage" element={<IsAuthenticated><QuestionManage /></IsAuthenticated>} />
        <Route path="reported-question-manage" element={<IsAuthenticated><ReportedQuestionManage /></IsAuthenticated>} />
        <Route path="reported-answer-manage" element={<IsAuthenticated><ReportedAnswerManage /></IsAuthenticated>} />
        <Route path="reported-comment-manage" element={<IsAuthenticated><ReportedCommentManage /></IsAuthenticated>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes