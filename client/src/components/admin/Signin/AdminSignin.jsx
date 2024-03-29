import { Info, Check, Cross } from "../../../assets/icons/Icons";
import React, { useRef, useState } from "react";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const PASSWORD_REGEX = /^.{8,}$/;

function AdminLogin() {
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");

    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const [validData, setValidData] = useState({
        email: false,
        password: false
    });

    const [focus, setFocus] = useState({
        email: false,
        password: false
    })


    const handleChange = ({ currentTarget: input }) => {
        setErrMsg('');
        errRef.current.blur();
        setData({ ...data, [input.name]: input.value });
        const regexName = input.name.toUpperCase() + '_REGEX';
        const regex = new RegExp(eval(regexName));
        const result = regex.test(input.value);
        setValidData({ ...validData, [input.name]: result });
    };

    const handleFocus = (event) => {
        const name = event.target.name;
        setFocus({ ...focus, [name]: true });
    };

    const handleBlur = (event) => {
        const name = event.target.name;
        setFocus({ ...focus, [name]: false });
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        //if button enabled with JS hack or other some reason
        const v1 = EMAIL_REGEX.test(data.email);
        const v2 = PASSWORD_REGEX.test(data.password);
        if (!v1 || !v2) {
            setErrMsg("invalid entry");
            errRef.current.focus();
            return;
        }
        try {
            setLoader(true);
            const response = await axios.post("/admin/signin", data);
            setLoader(false);
            if (response.data.message === 'Access Token is created.') {
                localStorage.setItem('admin', response.data.accessToken);
                navigate('/admin/');
            }
        } catch (err) {
            setLoader(false);
            if (!err?.response) {
                setErrMsg('No server response.');
            } else if (err.code === "ERR_NETWORK") {
                setErrMsg(err.message);
            } else if (err.response.data.message === 'Invalid credentials.') {
                setErrMsg("Email/Password is incorrect.");
            } else if (err.response.data.message === 'Internal server error.') {
                setErrMsg("Internal server error.");
            } else if (err.response.data.message === 'Something went wrong.') {
                setErrMsg("Something went wrong.");
            } else {
                setErrMsg('Signin Failed.');
            }
            errRef.current.focus();
        }
    };

    return (
        <>
            <div className='items-center justify-center flex' style={{ height: '85vh' }}>
                <div className="">
                    <div className="rounded-lg shadow-lg shadow-gray-300 bg-gray-100 w-full h-auto">
                        <div style={{ width: "362px" }} className="px-10 p-6">
                            <h1 className="text-3xl text-black tracking-wide select-none font-semibold uppercase text-center">
                                Admin Sign in
                            </h1>
                            <p
                                ref={errRef}
                                className={errMsg ? "errmsg text-red-700" : "offscreen"}
                            >
                                {errMsg}
                            </p>
                            <form id="signupForm" onSubmit={handleSignin} noValidate>
                                <div>
                                    <div>
                                        <input
                                            type="email"
                                            id="email"
                                            className="border my-3 border-gray-500 text-gray-900 text-md rounded-md  w-full p-3 focus:border-gray-800"
                                            placeholder="Email"
                                            name="email"
                                            required
                                            value={data.email}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                        {validData.email && (
                                            <div style={{ marginLeft: '246px' }} className="absolute -mt-12 text-green-400 text-xl pointer-events-none">
                                                <Check />
                                            </div>
                                        )}
                                        {!validData.email && data.email && (
                                            <div style={{ marginLeft: '246px' }} className="absolute -mt-12 text-red-400 text-xl pointer-events-none">
                                                <Cross />
                                            </div>
                                        )}
                                        <p
                                            className={
                                                focus.email && data.email && !validData.email
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
                                    <div>
                                        <input
                                            type="password"
                                            id="password"
                                            className="border my-3 border-gray-500 text-gray-900 text-md rounded-md  w-full p-3 focus:border-gray-800"
                                            placeholder="Password"
                                            name="password"
                                            required
                                            value={data.password}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                        {validData.password && (
                                            <div style={{ marginLeft: '246px' }} className="absolute -mt-12 text-green-400 text-xl pointer-events-none">
                                                <Check />
                                            </div>
                                        )}
                                        {!validData.password && data.password && (
                                            <div style={{ marginLeft: '246px' }} className="absolute -mt-12 text-red-400 text-xl pointer-events-none">
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
                                    <button
                                        className="w-full select-none p-4 bg-black  rounded-full text-white text-base font-roboto mt-3 font-semibold hover:bg-gray-800 disabled:hover:bg-black disabled:opacity-80"
                                        disabled={
                                            !validData.email ||
                                                !validData.password ||
                                                loader
                                                ? true
                                                : false
                                        }
                                        type="submit"
                                    >
                                        {loader ? 'Loading...' : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminLogin;
