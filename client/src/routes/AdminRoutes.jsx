import { Routes, Route } from "react-router-dom";
import AdminSigninPage from "../pages/admin/AdminSigninPage";
import NotFound from "../pages/Error/NotFound";
import Layout from "../pages/admin/Layout";


function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path="signin" element={<AdminSigninPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes