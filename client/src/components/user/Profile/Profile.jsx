import React, { useEffect, useState } from 'react'
import { Account, Cancel, Edit, Open, Save, SaveSubmit, SpinningWheel } from '../../../assets/icons/Icons';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../../redux/features/user/userDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../api/axios';

const NAME_REGEX = /^\S.{0,}\S$/
// const USERNAME_REGEX = /^[a-zA-z][a-zA-Z0-9-_]{4,23}$/;
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{4,23}$/;

export default function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.userData.userData)

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({
        name: '',
        userName: ''
    })
    const [validInputData, setValidInputData] = useState({
        name: true,
        userName: true,
    });

    useEffect(() => {
        setInputData(userData)
    }, [userData])

    const [focus, setFocus] = useState({
        email: false,
        password: false,
    });

    const handleFocus = (event) => {
        const name = event.target.name;
        setFocus({ ...focus, [name]: true });
    };

    const handleBlur = (event) => {
        const name = event.target.name;
        setFocus({ ...focus, [name]: false });
    };


    const handleEditButton = () => {
        setIsEditing(!isEditing)
    }

    const handleSubmitButton = async () => {
        setLoading(true);
        //Make a put request to submit edited values
        try {
            const token = localStorage.getItem('user');
            if (!token) {
                dispatch(getUserData());
            }
            setIsEditing(!isEditing)
            const res = await axios.put('/edit-profile/', { inputData }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                withCredentials: true,
            });
            dispatch(getUserData());
        } catch (err) {
            console.log(err.message);
        }

        setTimeout(() => {
            setLoading(false);
        }, 800)
    }

    const handleChangeDetails = ({ currentTarget: input }) => {
        setInputData({ ...inputData, [input.name]: input.value });
        const regexName = input.name.toUpperCase() + '_REGEX';
        const regex = new RegExp(eval(regexName));
        const result = regex.test(input.value);
        setValidInputData({ ...validInputData, [input.name]: result });
    };

    const handleCancelButton = () => {
        setIsEditing(false)
    }


    return (
        <div className=''>
            <div className='text-2xl capitalize font-semibold pb-5'>My Profile</div>
            <div className='flex flex-row border border-gray-300 justify-between pr-16 rounded-lg bg-gray-50 py-2'>                 {/* Profile */}
                <div className='w-fit'>                 {/* Image */}
                    <Account width='10em' height='10em' />
                </div>
                <div className='flex flex-col my-3 ml-5 rounded-sm border border-gray-300 bg-gray-100'>    {/* Personal Details */}
                    <div className='flex felx-row'>
                        <div className='flex flex-col gap-y-1 py-2 justify-center'>
                            <div className='flex flex-row justify-between'>
                                <div className='uppercase text-gray-800 text-lg tracking-normal font-medium px-2'>Name</div><div>:</div>
                            </div>
                            <div className='flex flex-row justify-between'>
                                <div className='uppercase text-gray-800 text-lg tracking-normal font-medium px-2'>User Name</div><div>:</div>
                            </div>
                            <div className='flex flex-row justify-between'>
                                <div className='uppercase text-gray-800 text-lg tracking-normal font-medium px-2'>Email</div><div>:</div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-y-1 px-4 py-2 justify-center'>
                            <div className='flex flex-row items-center justify-between gap-x-7 w-full'>   {/* Name */}
                                <div className='w-fit text-xl uppercase tracking-wide font-medium'>
                                    {!loading ?
                                        (!isEditing ? (<>{userData?.name}</>) :
                                            (<input
                                                type="text"
                                                value={inputData.name}
                                                onChange={handleChangeDetails}
                                                name='name'
                                                id='name'
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                className={`w-56 bg-white mb-0.5 p-0.5 rounded-sm outline-1 outline ${validInputData.name ? 'outline-green-700' : 'outline-[#ff0000]'}`}
                                            />)) :
                                        (<>{inputData?.name}</>)
                                    }
                                </div>
                            </div>
                            <div className='flex felx-row items-center justify-between gap-x-7 w-full'>   {/* User Name */}
                                <div className='w-fit text-lg tracking-[-0.020em] font-medium'>
                                    {!loading ?
                                        (!isEditing ? (<>{userData?.userName}</>) :
                                            (<input
                                                type="text"
                                                value={inputData.userName}
                                                onChange={handleChangeDetails}
                                                name='userName'
                                                id='userName'
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                className={`w-56 bg-white mb-0.5  p-0.5 rounded-sm outline-1  outline ${validInputData.userName ? 'outline-green-700' : 'outline-[#ff0000]'}`}
                                            />)) :
                                        (<>{inputData?.userName}</>)
                                    }
                                </div>
                            </div>
                            <div className='flex felx-row items-center justify-between gap-x-7 w-full'>   {/* Email */}
                                <div className='w-fit text-lg tracking-[-0.020em] font-medium'>
                                    {userData?.email}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end items-center pb-2 pr-5 gap-2'>
                        {!loading ?
                            (!isEditing ?
                                (<>
                                    <button onClick={handleEditButton}>
                                        <Edit width='1.4em' height='1.4em' />      {/* To display edit button */}
                                    </button>
                                </>) :
                                (<>
                                    <button disabled={!validInputData.name || !validInputData.userName} onClick={handleSubmitButton} className='disabled:text-gray-700 disabled:opacity-60'>
                                        <SaveSubmit width='1.5em' height='1.5em' /> {/* To display save button */}
                                    </button>
                                    <button onClick={handleCancelButton}>
                                        <Cancel width='1.3em' height='1.3em' color='red' /> {/* To display Cancel button */}
                                    </button>
                                </>)) :
                            (<>
                                <button>
                                    <SpinningWheel height={"1.5em"} />              {/* To display spinning button */}
                                </button>
                            </>)
                        }
                    </div>
                </div>
                <div className='flex flex-col gap-y-1 p-4 justify-center my-3 ml-5 w-[33%] rounded-sm border border-gray-300 bg-gray-100'> {/* Navigation Links */}
                    <div className='flex flex-row items-center justify-between  w-full hover:text-blue-800 cursor-pointer'
                        onClick={() => navigate('/forgot-password')}>
                        <div className='w-fit text-lg font-medium underline '>
                            Change or forgot password?
                        </div>
                        <button>
                            <Open width='1.4em' height='1.4em' />
                        </button>
                    </div>
                    <div className='flex felx-row items-center justify-between gap-x-7 w-full hover:text-blue-800 cursor-pointer'
                        onClick={() => navigate('/')}>
                        <div className='w-fit text-lg font-medium underline'>
                            Go to the home page.
                        </div>
                        <button>
                            <Open width='1.4em' height='1.4em' />
                        </button>
                    </div>
                    <div className='flex felx-row items-center justify-between gap-x-7 w-full hover:text-blue-800 cursor-pointer'
                        onClick={() => navigate('/signup')}>
                        <div className='w-fit text-lg font-medium underline'>
                            Create another account.
                        </div>
                        <button>
                            <Open width='1.4em' height='1.4em' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
