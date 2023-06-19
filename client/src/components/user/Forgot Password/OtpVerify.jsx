import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

function OtpVerify({ data, onSubmit }) {

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const [loader, setLoader] = useState(false);
    const [resendLoader, setResendLoader] = useState(false);
    const [otp, setOtp] = useState('')
    const [expiresAt, setExpiresAt] = useState(data.expiresAt)
    const email = data.email;

    const handleChangeEmail = () => {
        const authData = { 'state': 1 }
        onSubmit(authData)
    }


    const resendOtp = async (e) => {
        e.preventDefault()
        try {
            setResendLoader(true);
            setErrMsg('')
            const response = await axios.post('/forgot-password/otp-resend', { email });
            setExpiresAt(response.data.expiresAt);
            setResendLoader(false);
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
            setResendLoader(false);
        }
    }


    const handleOtpSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/forgot-password/otp-verify', { otp, email });
            if (response.data.message === 'OTP is correct, email verified.') {
                setErrMsg('OTP is correct, email verified.');
                const authData = { 'state': 3, 'token': response.data.accessToken }
                onSubmit(authData)
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
        }
    }

    //Countdown componenet for displaying remaing time to otp to expire.
    function Countdown({ expireTime }) {
        const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

        useEffect(() => {
            let intervalId = null;

            if (remainingTime > 0) {
                intervalId = setInterval(() => {
                    setRemainingTime(calculateRemainingTime());
                }, 1000);
            }
            return () => clearInterval(intervalId);
        }, [remainingTime]);

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

        return (
            <span>
                {remainingTime > 0 ? (
                    <>
                        <span>OTP expires in</span>
                        <span className='text-red-700 font-semibold'>&nbsp;{formatTime(remainingTime)}&nbsp;</span>
                        <span>minutes.</span>
                    </>
                ) : (
                    <span className='text-red-700'>OTP expired&nbsp;</span>
                )}
            </span>
        );
    }

    return (
        <>
            <div className='items-center justify-center flex' style={{ height: '91vh' }}>
                <div className="">
                    <div className="rounded-lg shadow-lg shadow-gray-300 bg-gray-100 w-90 h-auto">
                        <div style={{ width: "380px" }} className="px-8 sm:p-6">
                            <h2 className="text-2xl select-none font-semibold font-apple-system">
                                We sent a code to your email
                            </h2>
                            <p className="text-sm pt-2 font-sans mt-3 bo">
                                Enter the 6-digit verification code sent to
                            </p>
                            <div>
                                <span className="font-semibold">{data.email}</span><button className="text-linkedin text-sm font-medium hover:bg-opacity-25 mx-1 hover:bg-blue-500 rounded-2xl px-2 py-1 cursor-pointer" onClick={handleChangeEmail}>Change</button>
                            </div>
                            <form id="forgotPasswordForm" noValidate>
                                <div>
                                    <div className='relative mt-3'>
                                        <label
                                            htmlFor='otpInput'
                                            className="absolute left-4 top-4 text-gray-500 pointer-events-none  duration-500 transition-transform ease-in-out"
                                            style={{
                                                transform: `translateY(${otp ? '0' : '0'})`,
                                                fontSize: otp ? '0' : '1.1rem'
                                            }}
                                        >
                                            Enter 6-digit code
                                        </label>
                                        <input
                                            type="number"
                                            className="border mt-7 border-gray-500 text-gray-900 rounded-md  w-full p-3 focus:border-gray-800 tracking-[1em] font-medium text-xl text-center"
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            id='otpInput'
                                        />
                                    </div>
                                    <div className='flex justify-center items-center mt-3'>
                                        <p ref={errRef} className={errMsg ? "errmsg text-red-700" : "offscreen"} >
                                            {errMsg}
                                        </p>
                                    </div>
                                    <div className='flex items-center justify-center'>
                                        <p className='mr-1 text-sm'><Countdown expireTime={expiresAt} /></p>
                                        <button
                                            onClick={resendOtp}
                                            className="text-base my-2 text-linkedin font-medium hover:bg-sky-600 hover:bg-opacity-25 rounded-full hover:underline cursor-pointer px-2 py-1 disabled:opacity-60"
                                            disabled={
                                                resendLoader ? true : false
                                            }
                                        >
                                            {resendLoader ? 'Resending...' : 'Resend OTP'}
                                        </button>
                                    </div>
                                    <button
                                        className="w-full select-none p-4 bg-linkedin rounded-full text-white text-base font-roboto mt-3 font-semibold hover:bg-linkedin2 disabled:hover:bg-linkedin disabled:opacity-60"
                                        disabled={
                                            loader ? true : false
                                        }
                                        onClick={handleOtpSubmit}
                                    >
                                        {loader ? 'Loading...' : 'Submit'}
                                    </button>
                                    <div className="flex justify-center">
                                        <p className="text-sm text-gray-500 mt-6">If you don't see the email in your inbox, check your spam folder.</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default OtpVerify