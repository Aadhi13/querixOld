import { Outlet, useLocation } from "react-router-dom"
import Header from "../../components/user/Header"


function Layout() {
  const location = useLocation();
  return (
    <>
        {location.pathname !== '/signup' && location.pathname !== '/otp-verify' && location.pathname !== '/signin' && <Header />}
        <Outlet />  
    </>
  )
}

export default Layout