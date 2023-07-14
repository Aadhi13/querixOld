import { Info, Check, Cross } from "../../../assets/icons/Icons";
import Google from "../../../assets/logos/google.png";
import React, { useEffect, useRef, useState } from "react";
import axios from "../../../api/axios";
import { Link, useNavigate } from "react-router-dom";

const EMAIL_REGEX =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const PASSWORD_REGEX = /^.{8,}$/;

function Signin() {
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");

    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [validData, setValidData] = useState({
        email: false,
        password: false,
    });

    const [focus, setFocus] = useState({
        email: false,
        password: false,
    });

    //Google sign in
    useEffect(() => {
        // global google
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_OAUTH_WEB_CLIENT_ID,
            callback: handleGoogleSignInCallback,
        });

        google.accounts.id.renderButton(
            document.getElementById("googleSigninDiv"),
            {
                theme: "outline",
                type: "standard",
                size: "large",
                text: "continue_with",
                shape: "circle",
                width: "320px",
                height: "30px",
            }
        );
    }, []);

    async function handleGoogleSignInCallback(response) {
        console.log("Encoded JWT ID token: ", response.credential);
        try {
            const res = await axios.post(
                "/signin-google",
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: response.credential,
                    },
                    withCredentials: true,
                }
            );
            if (res.data.message === "Access Token is created.") {
                localStorage.setItem("user", res.data.accessToken);
                navigate("/");
            }
        } catch (err) {
            if (!err?.res) {
                setErrMsg("No server response.");
            } else if (err.message == "No jwt token.") {
                setErrMsg("Something went wrong.");
            } else if (err.message == "Something went wrong.") {
                setErrMsg("Something went wrong.");
            } else {
                setErrMsg("Signin Failed.");
            }
            errRef.current.focus();
        }
    }

    const handleChange = ({ currentTarget: input }) => {
        setErrMsg("");
        errRef.current.blur();
        setData({ ...data, [input.name]: input.value });
        const regexName = input.name.toUpperCase() + "_REGEX";
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
            const response = await axios.post("/signin", data);
            const email = data.email;
            const name = data.name;
            setLoader(false);
            if (
                response.data.message === "User is not verified, OTP sended to mail."
            ) {
                setErrMsg("This email is not verified, OTP sended to mail.");
                const expiresAt = response.data.expiresAt;
                navigate("/otp-verify", { state: { email, name, expiresAt } });
            } else if (response.data.message === "Access Token is created.") {
                localStorage.setItem("user", response.data.accessToken);
                navigate("/");
            }
        } catch (err) {
            setLoader(false);
            if (!err?.response) {
                setErrMsg("No server response.");
            } else if (err.code === "ERR_NETWORK") {
                setErrMsg(err.message);
            } else if (err.response.data.message === "Invalid credentials") {
                setErrMsg("Email/Password is incorrect.");
            } else if (err.response.data.message === "Error when creating otp.") {
                setErrMsg("Failed to send OTP. when creating");
            } else if (err.response.data.message === "Internal server error.") {
                setErrMsg("Internal server error.");
            } else if (err.response.data.message === "Something went wrong.") {
                setErrMsg("Something went wrong.");
            } else {
                setErrMsg("Signin Failed.");
            }
            errRef.current.focus();
        }
    };
    return (
        <>
            <div
                className="items-center justify-center flex"
                style={{ height: "91vh" }}
            >
                <div className="">
                    <div className="rounded-lg shadow-lg shadow-gray-300 bg-gray-100 w-90 h-auto">
                        <div style={{ width: "362px" }} className="px-10 sm:p-6">
                            <h1 className="text-3xl select-none font-semibold  font-roboto ">
                                Sign in
                            </h1>
                            <p className="text-sm py-2 font-sans">
                                Just play. Have fun. Enjoy the game.
                            </p>
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
                                            <div
                                                style={{ marginLeft: "273px" }}
                                                className="absolute -mt-12 text-green-400 text-xl pointer-events-none"
                                            >
                                                <Check />
                                            </div>
                                        )}
                                        {!validData.email && data.email && (
                                            <div
                                                style={{ marginLeft: "273px" }}
                                                className="absolute -mt-12 text-red-400 text-xl pointer-events-none"
                                            >
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
                                            <div
                                                style={{ marginLeft: "273px" }}
                                                className="absolute -mt-12 text-green-400 text-xl pointer-events-none"
                                            >
                                                <Check />
                                            </div>
                                        )}
                                        {!validData.password && data.password && (
                                            <div
                                                style={{ marginLeft: "273px" }}
                                                className="absolute -mt-12 text-red-400 text-xl pointer-events-none"
                                            >
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
                                    <div>
                                        <Link to={"/forgot-password"}>
                                            <span className="text-linkedin font-semibold hover:bg-sky-700 hover:bg-opacity-25 rounded-full hover:underline cursor-pointer px-2 py-1">
                                                Forgot passowrd?
                                            </span>
                                        </Link>
                                    </div>
                                    <button
                                        className="w-full select-none p-4 bg-linkedin rounded-full text-white text-base font-roboto mt-3 font-semibold hover:bg-linkedin2 disabled:hover:bg-linkedin disabled:opacity-60"
                                        disabled={
                                            !validData.email || !validData.password || loader
                                                ? true
                                                : false
                                        }
                                        type="submit"
                                    >
                                        {loader ? "Loading..." : "Sign in"}
                                    </button>
                                </div>
                            </form>
                            <div className="flex items-center my-4">
                                <hr className="w-1/2 " />
                                <p className="mx-3 text-sm text-gray-600">or</p>
                                <hr className="w-1/2" />
                            </div>
                            <div id="googleSigninDiv" className="flex justify-center">
                                {/* <button
                                    className="flex justify-center items-center border-2 select-none bg-white border-slate-300 text-slate-800 hover:bg-sky-50  rounded-full w-full text-md font-roboto font-medium p-2"
                                    onClick={()=>google.accounts.id.prompt()}
                                >
                                    <img
                                        src={Google}
                                        className="h-5 select-none pointer-events-none m-2"
                                        alt="Image of Google icon."
                                    />
                                    Sign in with Google
                                </button> */}
                            </div>
                        </div>
                    </div>
                    <div className="place-content-center">
                        <p className="items-center justify-center flex mt-8">
                            New to Querix?&nbsp;
                            <Link to="/signup">
                                <span className="text-linkedin font-semibold hover:bg-linkedin2 hover:bg-opacity-20 hover:rounded-full hover:underline px-2 py-1 cursor-pointer">
                                    Join now
                                </span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signin;
