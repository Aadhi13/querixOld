import { Routes, Route } from "react-router-dom";
import AdminSigninPage from "../pages/admin/AdminSigninPage";
import NotFound from "../pages/Error/NotFound";


function AdminRoutes() {
  return (
    <Routes>
      <Route path="signin" element={<AdminSigninPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AdminRoutes