import React, { useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../../api/axios';

const INPUT_REGEX = /[^\s\n]/;

export default function AnswerInput(props) {

    const { userData, question, onUpdate } = props;
    const [input, setInput] = useState('')
    const [validInput, setValidInput] = useState(false);
    const [rows, setRows] = useState(2);
    const [loader, setLoader] = useState(false);
    const textAreaRef = useRef(null);


    //To handle the textarea growing feature and changing input (increasing the rows when line breaks occuring in all possible ways)

    const texAreaHandleInput = (e) => {
        setInput(e.target.value);
        const result = INPUT_REGEX.test(e.target.value);
        setValidInput(result);
        const textarea = textAreaRef.current;
        const calContentHeight = (lineHeight) => {
            let origHeight = textarea.style.height;
            let height = textarea.offsetHeight;
            let scrollHeight = textarea.scrollHeight;
            if (height >= scrollHeight) {
                textarea.style.height = (height + lineHeight) + 'px';
                textarea.style.overflow = 'hidden';
                if (scrollHeight < textarea.scrollHeight) {
                    while (textarea.offsetHeight >= textarea.scrollHeight) {
                        textarea.style.height = (height -= lineHeight) + 'px';
                    }
                    while (textarea.offsetHeight < textarea.scrollHeight) {
                        textarea.style.height = (height++) + 'px';
                    }
                    textarea.style.height = origHeight;
                    return height
                }
            } else {
                return scrollHeight;
            }
        }
        const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight, 10);
        const scrollHeight = calContentHeight(lineHeight);
        const nLines = Math.floor(scrollHeight / lineHeight);
        if (nLines < 2) {
            setRows(2);
        } else {
            setRows(nLines);
        }
    }


    //Handle answer submit

    const handleAnswerSubmit = async (e) => {
        if (!validInput) {
            return;
        }
        e.preventDefault();
        try {
            setLoader(true);
            const token = localStorage.getItem('user')
            if (!token) {
                setInput('');
                setRows(2);
                showToastMessage('noUserAnswer')
                setLoader(false);
                return;
                //Can't answer question. Please login again.
            }
            const response = await axios.post('/add-answer', { input, questionId: question._id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                withCredentials: true
            });

            if (response.data.message == 'Answer submitted.') {
                setInput('');
                setRows(2);
                showToastMessage('successAnswer');
                onUpdate()
            }
            setLoader(false);
        } catch (err) {
            if (err == 'no token') {
                setInput('');
                setRows(2);
                showToastMessage('noUserAnswer')
                setLoader(false);
                //Can't submit answer. Please login again.
            } else if (err.response.data.message == 'Answer is not complete.') {
                showToastMessage('unfinishedAnswer')
                setLoader(false);
                //Can't submit unfinished question. Type both the tilte and your question.
            } else if (err.response.data.message == 'Invalid jwt token.' || 'Jwt expired.' || 'No user found.' || 'no token' || 'No jwt token.') {
                localStorage.removeItem('user')
                setInput('');
                setRows(2);
                showToastMessage('noUserAnswer')
                setLoader(false);
                //Can't submit answer. Please login again.
            } else if (err.response.data.message == 'Invalid question.') {
                setInput('');
                setRows(2);
                showToastMessage('noQuestion')
                setLoader(false);
            }
        }
    }


    //Tostify

    const showToastMessage = (type) => {
        if (type == 'noUserAnswer') {
            toast.error('Please login to answer question.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'unfinishedAnswer') {
            toast.warn('Complete answer to submit', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'successAnswer') {
            toast.success('Answer successfully submitted.', {
                position: toast.POSITION.TOP_CENTER,
            });
        } else if (type == 'errorNetwork') {
            toast.error('Network error occured.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        } else if (type == 'errorServer') {
            toast.error('Inernal server error.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        } else if (type == 'errorUnknown') {
            toast.error('Something went wrong.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        } else if (type == 'noQuestion') {
            toast.error('Invalid question.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        }
    };





    return (
        <>
            <ToastContainer />
            <div className='flex flex-row border-gray-400 border  rounded-lg mb-4'>
                <div className='p-2 flex flex-col items-center'>
                    <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className='flex flex-col pb-3 w-full'>
                    <div className='mt-2.5 flex justify-start items-center'>
                        <div className='mb-2.5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>{userData?.name}</div>
                            <div className='flex items-center ml-1 text-sm '>@{userData?.userName}</div>
                        </div>
                    </div>
                    {/* The textarea aka Input box for answering questions */}
                    <div>
                        <form>
                            <div className='flex justify-center items-center'>
                                <textarea placeholder={`Type your answer to ${question.userId?.name}'s question.`} ref={textAreaRef} className='overflow-hidden pr-1.5 mb-3 w-[98%] outline-none text-base' onInput={texAreaHandleInput} rows={rows} value={input} name='answer'></textarea>
                                <br />
                            </div>
                        </form>
                    </div>
                    <div className='flex justify-center mr-6 ml-0.5 items-center border-b border-gray-400 mt-3'></div>
                    <div className='flex justify-between items-center mt-3'>
                        <div className='flex justify-center items-center mr-6 py-1 px-4 font-medium text-lg'>
                            <button onClick={handleAnswerSubmit} disabled={!validInput} className='disabled:opacity-50 disabled:hover:bg-gray-400 bg-gray-400 hover:bg-profileBt rounded-2xl mr-6 py-1 px-4 font-medium text-lg'>
                                {!loader ? 'Submit' : 'Submiting...'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
