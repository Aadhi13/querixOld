import React, { forwardRef, useState } from 'react'
import Comment from './Comment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DownVote, UpVote } from '../../../assets/icons/Icons'
import axios from '../../../api/axios';

const Answer = forwardRef(function Answer(props, ref) {


    const { answer, index } = props;
    const [isReplaying, setIsReplaying] = useState(false)


    //Tostify

    const showToastMessage = (type) => {
        if (type == 'noUserVote') {
            toast.error('Please login to vote answer.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'noUserSave') {
            toast.error('Please login to save answer.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'linkCopied') {
            toast.success('Link copied to clipboard.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'AnswerSaveSuccess') {
            toast.success('Answer saved.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
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
        }
    };


    //Handle save answer

    const handleSaveAnswer = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserSave')
        } else {
            try {
                const response = await axios.put("/answer-save", { answerId: answer._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                if (response.data.message == 'Answer successfully saved.') {
                    showToastMessage('AnswerSaveSuccess')
                }
            } catch (err) {
                if (!err?.response) {
                    showToastMessage('errorServer')
                } else if (err.code === "ERR_NETWORK") {
                    showToastMessage('errorNetwork')
                } else if (err.response.data.message == 'User not found.') {
                    showToastMessage('noUserSave')
                } else if (err.response.data.message == "Internal server error.") {
                    showToastMessage('errorServer')
                } else {
                    showToastMessage('errorUnknown')
                }

            }
        }
    }


    return (
        <>

            <ToastContainer />

            <div ref={ref} key={answer._id} className='flex flex-row border-gray-300 border rounded-lg mb-4 bg-sky-100'>
                <div className='p-2'>
                    <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='p-1 mt-4'>
                        <div className='flex justify-center items-center hover:text-green-600 text-lg'>
                            <UpVote />
                        </div>
                        <div className='flex justify-center items-center text-lg'>
                            10
                        </div>
                        <div className='flex justify-center items-center hover:text-red-600 text-lg'>
                            <DownVote />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-full mr-12 my-3'>
                    <div className='mt-[1px]'>
                        <div className='flex items-center ml-1 text-base font-medium'>{answer?.author?.name}</div>
                        <div className='flex items-center ml-1 text-sm'>@{answer?.author?.userName}</div>
                    </div>
                    <div className='mt-4'>
                        <div className='pr-1.5 mb-3'>
                            {index + 1 + ': ' + answer.answer}  {/* Root answer with SI number(index+1) */}
                        </div>
                        {/* <div>
                            {isReplaying ?
                                <button
                                    className='text-red-700 bg-gray-400 text-sm font-semibold p-1 rounded-md hover:bg-black'
                                    onClick={() => setIsReplaying(false)}>
                                    Close
                                </button> :
                                <button
                                    className='text-black bg-green-300 text-sm font-semiboldbold p-1 rounded-md hover:bg-green-500'
                                    onClick={() => setIsReplaying(true)}>
                                    Comment
                                </button>
                            }
                        </div> */}
                        <div className='flex justify-start'>
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5' onClick={handleSaveAnswer} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                </svg>
                                <button className='ml-1 text-sm font-medium '>Save</button>
                            </div>
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5' >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className='w-5 h-5'>
                                    <path fill="currentColor" d="m237.66 106.35l-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91c-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z"></path>
                                </svg>
                                <button className='ml-1 text-sm font-medium '>Share</button>
                            </div>
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        isReplaying &&
                        <div className='w-[745px] my-5 '>
                            <input       // change the Input to the textarea 
                                type='text'
                                placeholder="what's your answer to this question"
                                className='border-black border-2 w-full h-full p-1 bg-slate-200'
                            />
                        </div>
                    }
                    {/* <div className='w-full'>
                        {answer && answer.comments.map((comment, index) => (
                            <Comment key={comment.id} comment={comment} index={index} />
                        ))}
                    </div> */}
                </div>
            </div>
        </>
    )
})

export default Answer