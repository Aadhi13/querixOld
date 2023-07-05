import { Outlet, useLocation } from "react-router-dom"
import HeaderMinimal from "../../components/admin/Header/HeaderMinimal";


function Layout() {
  const location = useLocation();
  return (
    <>
      {location.pathname == '/admin/signin' && <HeaderMinimal />}
      <Outlet />
    </>
  )
}

export default Layout