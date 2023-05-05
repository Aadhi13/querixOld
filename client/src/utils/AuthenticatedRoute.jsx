import { Navigate } from "react-router-dom";
import  jwtDecode  from "jwt-decode";

const isUserLoggedIn = () => {
    const token = localStorage.getItem('user');
    if (!token) return false;
    const decodeToken = jwtDecode(token);
    if (decodeToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('user');
        return false;
    }
    return true;
}


function AuthenticatedRoute({ children }) {
    if (!isUserLoggedIn()) {
        return <Navigate to='/signin' replace />;
    }
    return children;
};

export default AuthenticatedRoute;