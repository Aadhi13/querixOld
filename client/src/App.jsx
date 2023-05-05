import { Routes, Route } from "react-router-dom"

import UserRoutes from "./routes/UserRoutes"
import AdminRoutes from "./routes/AdminRoutes"

function App() {
  return (
    <Routes>
      <Route path="/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" />
    </Routes>
  )
}

export default App
