import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from "../../../api/axios";

function OtpVerify() {
    const [otp, setOtp] = useState('');
    const location = useLocation();
    const { email, name } = location.state;
    const [expiresAt, setExpiresAt] = useState(location.state.expiresAt)
    const [loader, setLoader] = useState(false);
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();

    const resendOtp = async (e) => {
        e.preventDefault();
        console.log('clicked')
        try {
            setLoader(true);
            const response = await axios.post('/otp-resend', { email });
            setExpiresAt(response.data.expiresAt);
            setLoader(false);
            console.log(response.data.message);
            if (response.data.message === 'Request is received') {
                setErrMsg('Successfully resent OTP; check your mail.')
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response.');
            } else if (err.code === "ERR_NETWORK") {
                setErrMsg(err.message);
            } else if (err.response.data.message === 'Something went wrong.') {
                setErrMsg('Something went wrong.');
            } else {
                setErrMsg('Something went wrong.');
            }
            errRef.current.focus();
            setLoader(false);
            console.log(err.code);
            console.log(err.message);
            console.log(err.response.data.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/otp-verify', { otp, email });
            console.log(response.data.message)
            if (response.data.message === 'Email is already verified.') {
                setErrMsg('Email is already verified.');
                navigate('/signin');
            } else if (response.data.message === 'OTP is correct, email verified.') {
                setErrMsg('OTP is correct, email verified.');
                navigate('/signin');
            }

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response.');
            } else if (err.code === "ERR_NETWORK") {
                setErrMsg(err.message);
            } else if (err.response.data.message === 'OTP is expired.') {
                setErrMsg('OTP is expired.');
            } else if (err.response.data.message === 'OTP is not valid.') {
                setErrMsg('OTP is not valid.');
            } else if (err.response.data.message === 'Internal server error.') {
                setErrMsg('Internal server error.');
            } else if (err.response.data.message === 'Something went wrong.') {
                setErrMsg("Something went wrong.");
            } else {
                setErrMsg('Registration Failed.');
            }
            errRef.current.focus();

            console.log(err.code);
            console.log(err.message);
            console.log(err.response.data.message);
        }
    }

    //Countdown componenet for displaying remaing time to otp to expire.
    function Countdown({ expireTime }) {
        const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

        useEffect(() => {
            const intervalId = setInterval(() => {
                setRemainingTime(calculateRemainingTime());
            }, 1000);
            return () => clearInterval(intervalId);
        }, []);

        function calculateRemainingTime() {
            const now = new Date();
            const diff = new Date(expireTime) - now;
            return diff > 0 ? diff : 0;
        }

        function formatTime(time) {
            const seconds = Math.floor(time / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        return <span className='text-red-700 font-semibold'>&nbsp;{formatTime(remainingTime)}&nbsp;</span>;
    }


    return (
        <>
            <div className='items-center justify-center flex max-w-2xl m-auto' style={{ height: '100vh' }}>
                <div className='rounded-lg shadow-lg shadow-gray-300 bg-gray-100 p-6'>
                    <h1 className='flex justify-center font-bold text-4xl mb-6 mt-2'>Email Verification </h1>
                    <p className='text-center'>Hi <span className='font-medium'>{name}</span>, we emailed you the six digit code to <span className='font-medium'>{email}</span>. Enter the code below to confirm your email address.</p>
                    <form className='mb-5 mt-6 flex items-center  justify-center' onSubmit={handleSubmit}>
                        <input type="text"
                            required
                            className='border border-gray-500 text-gray-900 text-lg rounded-md py-1 w-20 text-center'
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button type="submit" className='bg-emerald-500 ml-4 font-medium border border-gray-500 text-gray-900 text-lg rounded-md py-1 w-20 text-center' >Verify</button>
                    </form>
                    <div className='flex justify-center items-center mb-2'>
                        <p ref={errRef} className={errMsg ? "errmsg text-red-700" : "offscreen"} >
                            {errMsg}
                        </p>
                    </div>
                    <div className='flex items-center justify-center'>
                        <p className='mr-1 flex items-center justify-center'>OTP expires in<Countdown expireTime={expiresAt} />minutes.</p>
                        <button
                            onClick={resendOtp}
                            className="text-red-600 font-semibold hover:bg-red-900 hover:bg-opacity-20 hover:rounded-full hover:underline px-2 py-1 cursor-pointer disabled:opacity-60"
                            disabled={
                                loader ? true : false
                            }
                        >
                            {loader ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OtpVerify