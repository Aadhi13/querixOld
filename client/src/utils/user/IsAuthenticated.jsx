import React, { Children, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUserData } from '../../redux/features/user/userDataSlice';
import { useDispatch } from 'react-redux';

export default function IsAuthenticated({ children }) {
    const location = useLocation()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        //To check if user is logged in by verifying JWT token and getting user's data(name, username, email,...).
        dispatch(getUserData());
        //after running above function if user is logged in then the 'user' key in localstorge will remain other wise it will be removed.
        if (localStorage.getItem('user')) {
            //user is logged in. 
            if (location.pathname == '/signin') {
                //If user is accessing the '/signin' route when signed in then goes to home page.
                return navigate("/")
            }
        } else if (location.pathname == '/account') {
            return navigate("/")
        }
    }, [])
    return children
}