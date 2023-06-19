import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { Info, Check, Cross } from "../../../assets/icons/Icons";
import React, { useRef, useState } from 'react'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,}$/;

function NewPassword({ token }) {
    const [loader, setLoader] = useState(false);
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();

    const [data, setData] = useState({
        password: '',
        confirmPassword: ''
    })

    const [validData, setValidData] = useState({
        password: false,
        confirmPassword: false
    });

    const [focus, setFocus] = useState({
        password: false,
        confirmPassword: false
    })

    const handleChangePassword = (e) => {
        setData({ ...data, password: e.target.value });
        const result = PASSWORD_REGEX.test(e.target.value);
        setValidData({ ...validData, password: result });
    };

    const handleChangeConfirmPassword = (e) => {
        const confirmPassword = e.target.value
        const result = data.password == confirmPassword;
        setValidData({ ...validData, confirmPassword: result });
        setData({ ...data, confirmPassword: confirmPassword });
    };


    const handleFocus = (event) => {
        const name = event.target.name;
        setFocus({ ...focus, [name]: true });
    };

    const handleBlur = (event) => {
        const name = event.target.name;
        setFocus({ ...focus, [name]: false });
    };


    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        const v1 = PASSWORD_REGEX.test(data.password);
        const v2 = data.password == data.confirmPassword;
        if (!v1 || !v2) {
            setErrMsg("invalid entry");
            return;
        }
        try {
            setLoader(true);
            const response = await axios.put("/forgot-password/new-password", { password: data.password }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                withCredentials: true
            });
            if (response.data.message === 'Password updated.') {
                setLoader(false);
                navigate("/signin")
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response.');
            } else if (err.code === "ERR_NETWORK") {
                setErrMsg(err.message);
            } else if (err.response.data.message === 'Invalid credentials') {
                setErrMsg(`We couldn't find an account associated with this email. Please try with an alternate email.`);
            } else if (err.response.data.message === 'No jwt token.') {
                setErrMsg("Authentication error. Try again.");
            } else if (err.response.data.message === 'Invalid jwt token.') {
                setErrMsg("Authentication error. Try again.");
            } else if (err.response.data.message === 'Jwt expired.') {
                setErrMsg("Took too much time. Try again.")
            } else if (err.response.data.message === 'invalid token') {
                setErrMsg("Authentication error. Try again.");
            } else if (err.response.data.message === 'Internal server error.') {
                setErrMsg("Internal server error.");
            } else if (err.response.data.message === 'Something went wrong.') {
                setErrMsg("Something went wrong.");
            } else {
                setErrMsg('Resetting password failed.');
            }
            setLoader(false)
            errRef.current.focus();
        }
    }


    return (
        <>
            <div className='items-center justify-center flex' style={{ height: '91vh' }}>
                <div className="">
                    <div className="rounded-lg shadow-lg shadow-gray-300 bg-gray-100 w-90 h-auto">
                        <div style={{ width: "380px" }} className="px-8 sm:p-6" noValidate onSubmit={handleSubmitPassword}>
                            <h2 className="text-2xl select-none font-bold font-apple-system">
                                Choose a new password.
                            </h2>
                            <p className="text-sm font-sans mt-3 bo">
                                Create a new password that is at least 8 characters long.
                            </p>
                            <div>
                                <input
                                    type="password"
                                    id="password"
                                    className="border mt-7 border-gray-500 text-gray-900 text-md rounded-md  w-full p-3 focus:border-gray-800"
                                    placeholder="New password"
                                    name="password"
                                    required
                                    value={data.password}
                                    onChange={handleChangePassword}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                                {validData.password && (
                                    <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-green-400 text-xl pointer-events-none">
                                        <Check />
                                    </div>
                                )}
                                {!validData.password && data.password && (
                                    <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-red-400 text-xl pointer-events-none">
                                        <Cross />
                                    </div>
                                )}
                                <p
                                    className={
                                        focus.password && data.password && !validData.password
                                            ? "block font-roboto text-red-700 bg-[#f0e1e1] mb-2 rounded p-2"
                                            : "hidden"
                                    }
                                >
                                    <Info />
                                    The password you provided must have at least 8 characters.
                                </p>
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="border mt-5 border-gray-500 text-gray-900 text-md rounded-md  w-full p-3 focus:border-gray-800"
                                    placeholder="Retype new password"
                                    name="confirmPassword"
                                    required
                                    value={data.confirmPassword}
                                    onChange={handleChangeConfirmPassword}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                                {validData.confirmPassword && (
                                    <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-green-400 text-xl pointer-events-none">
                                        <Check />
                                    </div>
                                )}
                                {!validData.confirmPassword && data.confirmPassword && (
                                    <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-red-400 text-xl pointer-events-none">
                                        <Cross />
                                    </div>
                                )}
                                <p
                                    className={
                                        focus.confirmPassword && data.confirmPassword && !validData.confirmPassword
                                            ? "block font-roboto text-red-700 bg-[#f0e1e1] mb-2 rounded p-2"
                                            : "hidden"
                                    }
                                >
                                    <Info />
                                    Passwords do not match.
                                </p>
                            </div>
                            <div className='flex justify-center items-center mt-3'>
                                <p ref={errRef} className={errMsg ? "errmsg text-red-700" : "offscreen"} >
                                    {errMsg}
                                </p>
                            </div>
                            <button
                                className="w-full select-none p-4 bg-linkedin rounded-full text-white text-base font-roboto mt-3 font-semibold hover:bg-linkedin2 disabled:hover:bg-linkedin disabled:opacity-60"
                                disabled={
                                    !validData.password || !validData.confirmPassword ||
                                        loader
                                        ? true
                                        : false
                                }
                                onClick={handleSubmitPassword}
                            >
                                {loader ? 'Loading...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewPassword