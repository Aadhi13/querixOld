import React from 'react';
import Signin from '../../components/user/Signup & Signin/Signin';
import backgroundImage from '../../assets/Images/typing.jpg';
import HeaderMinimal from '../../components/user/HeaderMinimal';
import { Link } from 'react-router-dom';

function SigninPage() {
    return (
        <>
            <div className='relative z-10'>
                <HeaderMinimal />
            </div>
            <div
                className="absolute inset-0 z-0 blur-sm bg-cover bg-center"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundAttachment: 'fixed',
                    WebkitBackgroundSize: 'cover',
                    MozBackgroundSize: 'cover',
                    OBackgroundSize: 'cover',
                    backgroundSize: 'cover',
                }}
            ></div>

            <div className="relative z-10">
                <Signin />
            </div>
            <div className="relative text-end mr-5 mt-5 text-gray-500 text-xs lg:text-base">
                Photo by <Link to="https://www.pexels.com/photo/hands-typing-on-a-laptop-keyboard-5474294/" className='text-blue-400'>cottonbro studio</Link>
            </div>
        </>

    )
}

export default SigninPage;