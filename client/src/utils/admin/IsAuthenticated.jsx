import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAdminData } from '../../redux/features/admin/adminDataSlice';
import { useDispatch } from 'react-redux';

export default function IsAuthenticated({ children }) {
    const location = useLocation()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        //To check if admin is logged in by verifying JWT token and getting admin's data(name, username, email,...).
        dispatch(getAdminData());
        //after running above function if admin is logged in then the 'admin' key in localstorge will remain other wise it will be removed.
        if (localStorage.getItem('admin')) {
            console.log('We got the admin in local storage')
            //admin is logged in. 
            if (location.pathname == '/admin/signin') {
                //If admin is accessing the '/signin' route when signed in then goes to home page.
                navigate("/admin/");
            }
        } else {
            // admin is not logged in 
            if (location.pathname == '/admin/') {
                navigate('/admin/signin');
            }
        }
    }, [])
    return children
}