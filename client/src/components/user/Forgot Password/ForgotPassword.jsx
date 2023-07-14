import { Info, Check, Cross } from "../../../assets/icons/Icons";
import Google from "../../../assets/logos/google.png";
import React, { useRef, useState } from 'react';
import axios from "../../../api/axios";
import { Link, useNavigate } from "react-router-dom";

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

function ForgotPassword({ onSubmit }) {
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");

    const [email, setEmail] = useState("")

    const [validEmail, setValidEmail] = useState(false);

    const [focus, setFocus] = useState({
        email: false,
    })


    const handleChange = (e) => {
        setErrMsg('');
        errRef.current.blur();
        setEmail(e.target.value);
        const result = EMAIL_REGEX.test(e.target.value);
        setValidEmail(result);
    };


    const handleFocus = (e) => {
        const name = e.target.name;
        setFocus({ ...focus, [name]: true });
    };

    const handleBlur = (e) => {
        const name = e.target.name;
        setFocus({ ...focus, [name]: false });
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        //if button enabled with JS hack or other some reason
        const v1 = EMAIL_REGEX.test(email);
        if (!v1) {
            setErrMsg("invalid entry");
            errRef.current.focus();
            return;
        }
        try {
            setLoader(true);
            setErrMsg('');
            const response = await axios.post("/forgot-password", { email });
            setLoader(false);
            if (response.data.message === 'OTP sended to mail.') {
                const userData = {'expiresAt':response.data.expiresAt, 'email':email}
                onSubmit(userData);

            }
        } catch (err) {
            setLoader(false);
            if (!err?.response) {
                setErrMsg('No server response.');
            } else if (err.code === "ERR_NETWORK") {
                setErrMsg(err.message);
            } else if (err.response.data.message === 'Invalid email.') {
                setErrMsg(`We couldn't find an account associated with ` + email + `. Please try with an alternate email.`);
            } else if (err.response.data.message === "Error when creating otp.") {
                setErrMsg("Failed to send OTP.");
            } else if (err.response.data.message === 'Internal server error.') {
                setErrMsg("Internal server error.");
            } else if (err.response.data.message === 'Something went wrong.') {
                setErrMsg("Something went wrong.");
            } else {
                setErrMsg("Something went wrong.");
            }
            errRef.current.focus();
        }
    }
    return (
        <>
            <div className='items-center justify-center flex' style={{ height: '91vh' }}>
                <div className="">
                    <div className="rounded-lg shadow-lg shadow-gray-300 bg-gray-100 w-90 h-auto">
                        <div style={{ width: "380px" }} className="px-8 sm:p-6">
                            <h1 className="text-3xl select-none font-semibold  font-roboto ">
                                Forgot password?
                            </h1>
                            <p className="text-sm py-2 font-sans">
                                Reset password in two quick steps
                            </p>
                            <p
                                ref={errRef}
                                className={errMsg ? "errmsg text-red-700" : "offscreen"}
                            >
                                {errMsg}
                            </p>
                            <form id="signupForm" onSubmit={handleResetPassword} noValidate>
                                <div>
                                    <div>
                                        <input
                                            type="email"
                                            id="email"
                                            className="border my-3 border-gray-500 text-gray-900 text-md rounded-md  w-full p-3 focus:border-gray-800"
                                            placeholder="Email"
                                            name="email"
                                            required
                                            value={email}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                        {validEmail && (
                                            <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-green-400 text-xl pointer-events-none">
                                                <Check />
                                            </div>
                                        )}
                                        {!validEmail && email && (
                                            <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-red-400 text-xl pointer-events-none">
                                                <Cross />
                                            </div>
                                        )}
                                        <p
                                            className={
                                                focus.email && email && !validEmail
                                                    ? "block font-roboto text-red-700 bg-[#f0e1e1] mb-2 rounded p-2"
                                                    : "hidden"
                                            }
                                        >
                                            <Info />
                                            Are you sure this is your email address?
                                            <br />
                                            It looks like this is not a valid email.
                                        </p>
                                    </div>
                                    <button
                                        className="w-full select-none p-4 bg-linkedin rounded-full text-white text-base font-roboto mt-3 font-semibold hover:bg-linkedin2 disabled:hover:bg-linkedin disabled:opacity-60"
                                        disabled={
                                            !email ||
                                                loader
                                                ? true
                                                : false
                                        }
                                        type="submit"
                                    >
                                        {loader ? 'Loading...' : 'Reset password'}
                                    </button>
                                    <div className="flex justify-center">
                                        <span className=" px-2 py-1 mt-3 hover:bg-gray-200 hover:rounded-2xl hover:underline font-medium text-gray-600 hover:text-black cursor-pointer"
                                            onClick={() => navigate(-1)}>
                                            Back
                                        </span>
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

export default ForgotPassword