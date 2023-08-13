import React from 'react';
import Signup from '../../components/user/Signup & Signin/Signup';
import backgroundImage from '../../assets/Images/typing.jpg';
import HeaderMinimal from '../../components/user/HeaderMinimal';
import { Link } from 'react-router-dom';

function SignupPage() {
    return (
        <>
            <div className='relative z-10'>
                <HeaderMinimal />
            </div>
            <div className="absolute inset-0 z-0 blur-sm bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
            <div className="relative z-10">
                <Signup />
            </div>
            <div className="relative text-end mr-5 mt-5 text-gray-500">
                Photo by <Link to="https://www.pexels.com/photo/hands-typing-on-a-laptop-keyboard-5474294/" className='text-blue-400'>cottonbro studio</Link>
            </div>
        </>
    )
}

export default SignupPage;