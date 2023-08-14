import { Info, Check, Cross } from "../../../assets/icons/Icons";
import Google from "../../../assets/logos/google.png";
import React, { useEffect, useRef, useState } from 'react';
import axios from "../../../api/axios";
import { Link, useNavigate } from "react-router-dom";

const NAME_REGEX = /^\S.{0,}\S$/
const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const USERNAME_REGEX = /^[a-zA-z][a-zA-Z0-9-_ ]{4,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,}$/;

function Signup() {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const [data, setData] = useState({
    name: '',
    userName: '',
    email: '',
    password: ''
  })

  const [validData, setValidData] = useState({
    email: false,
    name: false,
    userName: false,
    password: false
  });

  const [focus, setFocus] = useState({
    name: false,
    email: false,
    password: false,
    userName: false
  })


  //Google sign in 
  useEffect(() => {
    // global google
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_OAUTH_WEB_CLIENT_ID,
      callback: handleGoogleSignInCallback,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignupDiv"),
      {
        theme: "outline",
        type: "standard",
        size: "large",
        text: "signup_with",
        shape: "circle",
        width: "320px",
        height: "30px",
      }
    )

  }, [])

  async function handleGoogleSignInCallback(response) {
    try {
      const res = await axios.post('/signin-google', {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: response.credential,
        },
        withCredentials: true,
      });
      if (res.data.message === 'Access Token is created.') {
        localStorage.setItem('user', res.data.accessToken);
        navigate('/');
      }
    } catch (err) {
      if (!err?.res) {
        setErrMsg('No server response.');
      } else if (err.message == 'No jwt token.') {
        setErrMsg('Something went wrong.');
      } else if (err.message == 'Something went wrong.') {
        setErrMsg('Something went wrong.');
      } else {
        setErrMsg('Signup Failed.');
      }
      errRef.current.focus();
    }
  }

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    const regexName = input.name.toUpperCase() + '_REGEX';
    const regex = new RegExp(eval(regexName));
    const result = regex.test(input.value);
    setValidData({ ...validData, [input.name]: result });

    //check if userName is already exist

  };

  const handleFocus = (event) => {
    const name = event.target.name;
    setFocus({ ...focus, [name]: true });
  };

  const handleBlur = (event) => {
    const name = event.target.name;
    setFocus({ ...focus, [name]: false });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    //if button enabled with JS hack or other some reason
    const v1 = NAME_REGEX.test(data.name);
    const v2 = EMAIL_REGEX.test(data.email);
    const v3 = PASSWORD_REGEX.test(data.password);
    const v4 = USERNAME_REGEX.test(data.userName);
    if (!v1 || !v2 || !v3 || !v4) {
      setErrMsg("invalid entry");
      return;
    }
    try {
      setLoader(true);
      const response = await axios.post("/signup", data);
      const email = data.email;
      const name = data.name;
      const expiresAt = response.data.expiresAt;
      setLoader(false);
      navigate('/otp-verify', { state: { email, name, expiresAt } });
    } catch (err) {
      setLoader(false);
      if (!err?.response) {
        setErrMsg('No server response.');
      } else if (err.code === "ERR_NETWORK") {
        setErrMsg(err.message);
      } else if (err.response.data.message === 'User Exist') {
        setErrMsg("There is already have an account associated with your email. Try Sign in.");
      } else if (err.response.data.message === "Error when creating otp.") {
        setErrMsg("Failed to send OTP. when creating");
      } else if (err.response.data.message === 'Internal server error.') {
        setErrMsg("Internal server error.");
      } else if (err.response.data.message === 'Something went wrong.') {
        setErrMsg("Something went wrong.");
      } else {
        setErrMsg('Registration Failed.');
      }
      errRef.current.focus();
    }
  }

  return (
    <>
      <div className='items-center justify-center flex' style={{ height: '86vh' }}>
        <div className="">
          <div className="rounded-lg shadow-sm shadow-gray-500 bg-gray-200 bg-opacity-90 w-90 h-auto">
            <div style={{ width: "362px" }} className="sm:px-8 px-5 py-8">
              <h1 className="text-3xl select-none font-semibold  font-roboto ">
                Sign up
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
              <form id="signupForm" onSubmit={handleSignup} noValidate>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="off"
                      className="border my-3 border-gray-500 text-gray-900 text-md rounded-md  w-full p-3 focus:border-gray-800"
                      placeholder="Name"
                      required
                      value={data.name}
                      ref={userRef}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    {validData.name && (
                      <div style={{ marginLeft: '273px' }} className="absolute  -mt-12 text-green-400 text-xl pointer-events-none">
                        <Check />
                      </div>
                    )}
                    {!validData.name && data.name && (
                      <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-red-400 text-xl pointer-events-none">
                        <Cross />
                      </div>
                    )}
                    <p
                      className={
                        focus.name && data.name && !validData.name
                          ? "block font-roboto text-red-700 bg-[#f0e1e1] rounded p-2"
                          : "hidden"
                      }
                    >
                      <Info />
                      Accept all letters, numbers, and
                      <br />
                      special characters.
                      <br />
                      Must include at least two values.
                      <br />
                      Can't begin with or end with spaces.
                    </p>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="userName"
                      className="border my-3 border-gray-500 text-gray-900 text-md rounded-md  w-full p-3 focus:border-gray-800"
                      placeholder="User Name"
                      name="userName"
                      required
                      value={data.userName}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    {validData.userName && (
                      <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-green-400 text-xl pointer-events-none">
                        <Check />
                      </div>
                    )}
                    {!validData.userName && data.userName && (
                      <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-red-400 text-xl pointer-events-none">
                        <Cross />
                      </div>
                    )}
                    <p
                      className={
                        focus.userName && data.userName && !validData.userName
                          ? "block font-roboto text-red-700 bg-[#f0e1e1] mb-2 rounded p-2"
                          : "hidden"
                      }
                    >
                      <Info />
                      5 to 23 character.
                      <br />
                      Must begin with a letter.
                      <br />
                      Letters, numbers, underscores,
                      <br />
                      hyphens allowed.
                    </p>
                  </div>
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
                      <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-green-400 text-xl pointer-events-none">
                        <Check />
                      </div>
                    )}
                    {!validData.email && data.email && (
                      <div style={{ marginLeft: '273px' }} className="absolute -mt-12 text-red-400 text-xl pointer-events-none">
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
                      Minimum 8 characters.
                      <br />
                      Must include uppercase and lowercase
                      <br />
                      letters, a number and a special character.
                      <br />
                      Allowed special character: <span>! @ # * $ %</span>
                    </p>
                  </div>
                  {/* <div className="text-linkedin font-semibold">
                    Forgot passowrd?
                  </div> */}
                  <button
                    className="w-full select-none p-4 bg-linkedin rounded-full text-white text-base font-roboto mt-3 font-semibold hover:bg-linkedin2 disabled:hover:bg-linkedin disabled:opacity-60"
                    disabled={
                      !validData.name ||
                        !validData.email ||
                        !validData.password ||
                        !validData.userName ||
                        loader
                        ? true
                        : false
                    }
                    type="submit"
                  >
                    {loader ? 'Loading...' : 'Sign up'}
                  </button>
                </div>
              </form>
              <div className="flex items-center my-4">
                <hr className="w-1/2 " />
                <p className="mx-3 text-sm text-gray-600">or</p>
                <hr className="w-1/2" />
              </div>
              <div id="googleSignupDiv" className="flex justify-center">
                {/* <button className="flex justify-center items-center border-2 select-none bg-white border-slate-300 text-slate-800 hover:bg-[#edf3f2]  rounded-full w-full text-md font-roboto font-medium p-2">
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
          <div className="place-content-center bg-black bg-opacity-[60%] rounded-lg p-4 text-center mt-5">
            <p className="text-white">
              Already have an account?&nbsp;
              <Link to="/signin">
                <span className="text-sky-500 font-semibold hover:bg-sky-700 hover:bg-opacity-20 rounded-full hover:underline px-2 py-1 cursor-pointer transition">
                  Sign in
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup;
