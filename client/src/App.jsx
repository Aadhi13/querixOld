import { Routes, Route } from "react-router-dom"

import UserRoutes from "./routes/UserRoutes"
import AdminRoutes from "./routes/AdminRoutes"

import NotFound from "./pages/Error/NotFound"

function App() {
  return (
    <Routes>
      <Route path="/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
