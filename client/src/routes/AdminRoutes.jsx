import { Routes, Route } from "react-router-dom";
import AdminSigninPage from "../pages/admin/AdminSigninPage";


function AdminRoutes() {
  return (
    <Routes>
      <Route path="signin" element={<AdminSigninPage />} />
    </Routes>
  )
}

export default AdminRoutes