import { Outlet, useLocation } from "react-router-dom"
import Header from "../../components/user/Header"
import HeaderMinimal from "../../components/user/HeaderMinimal";


function Layout() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/signup' && location.pathname !== '/otp-verify' && location.pathname !== '/signin' && location.pathname !== '/forgot-password' && <Header />}
      {(location.pathname == '/signup' || location.pathname == '/otp-verify' || location.pathname == '/signin' || location.pathname == '/forgot-password') && <HeaderMinimal />}
      <Outlet />
    </>
  )
}

export default Layout