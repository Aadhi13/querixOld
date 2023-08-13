import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { DownVote, UpVote } from '../../../assets/icons/Icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

export default function SavedAnswer(props) {

    const { savedAnswer, onUpdate } = props;
    const [save, setSave] = useState(false);
    const userData = useSelector((state) => state.userData.userData)
    const navigate = useNavigate();

    useEffect(() => {
        if (userData?.savedAnswers?.includes(savedAnswer?._id)) {
            setSave(true)
        }
    }, [savedAnswer, userData])


    const showToastMessage = (type) => {
        if (type == 'answerSaveSuccess') {
            toast.success('Answer saved.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        } else if (type == 'answerUnsaveSuccess') {
            toast.success('Answer unsaved.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        } else if (type == 'linkCopied') {
            toast.success('Link copied to clipboard.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
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
    }


    //Handle share answer
    const handleShareAnswer = () => {
        showToastMessage('linkCopied')
        navigator.clipboard.writeText(window.location.origin + '/question/' + savedAnswer.question + '#' + savedAnswer._id)
    }

    //Navigate to question page and highlite answer when user clicks on answers
    const answerNavigateHandle = () => {
        navigate(`/question/${savedAnswer.question}#${savedAnswer._id}`, { state: { isAnswer: true } })
    }

    const upVoteHandle = async () => {

        let vote;
        const userId = await savedAnswer?.votes.upVote.userId
        if (userId.includes(userData._id)) {
            vote = 1;
        } else if (savedAnswer.votes.downVote.userId.includes(userData._id)) {
            vote = -1;
        } else {
            vote = 0;
        }

        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserVote')
        } else {
            //Update state 
            if (vote == -1 || vote == 0) {
                const response = await axios.put("/answer-vote", { voteIs: 'upVote', answerId: savedAnswer._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                onUpdate()
            } else if (vote == 1) {
                const response = await axios.put("/answer-vote", { voteIs: 'neutral', answerId: savedAnswer._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                onUpdate()
            }
        }
    }

    const downVoteHandle = async () => {

        let vote;
        const userId = await savedAnswer?.votes.upVote.userId
        if (userId.includes(userData._id)) {
            vote = 1;
        } else if (savedAnswer.votes.downVote.userId.includes(userData._id)) {
            vote = -1;
        } else {
            vote = 0;
        }

        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserVote')
        } else {
            //Update state
            if (vote == 1 || vote == 0) {
                const response = await axios.put("/answer-vote", { voteIs: 'downVote', answerId: savedAnswer._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                onUpdate()
            } else if (vote == -1) {
                const response = await axios.put("/answer-vote", { voteIs: 'neutral', answerId: savedAnswer._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                onUpdate()
            }
        }
    }


    //Handle save answer
    const handleSaveAnswer = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserSave')
        } else {
            try {
                const response = await axios.put("/answer-save", { answerId: savedAnswer._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                if (response.data.message == 'Answer successfully saved.') {
                    showToastMessage('answerSaveSuccess')
                    setSave(true)
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


    //Handle Unsave questoin
    const handleUnsaveAnswer = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            return;
        } else {
            try {
                const response = await axios.put("/answer-unsave", { answerId: savedAnswer._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                if (response.data.message == 'Answer successfully unsaved.') {
                    showToastMessage('answerUnsaveSuccess')
                    setSave(false)
                }
            } catch (err) {
                if (!err?.response) {
                    showToastMessage('errorServer')
                } else if (err.code === "ERR_NETWORK") {
                    showToastMessage('errorNetwork')
                } else if (err.response.data.message == 'User not found.') {
                    showToastMessage('noUserUnsave')
                } else if (err.response.data.message == "Internal server error.") {
                    showToastMessage('errorServer')
                } else {
                    showToastMessage('errorUnknown')
                }

            }
        }
    }



    return (
        <div>
            <div className={`flex flex-row border-gray-400 border rounded-lg ${savedAnswer.blockStatus ? 'bg-red-100' : 'bg-gray-100'}  hover:bg-gray-200`}>
                <div className='p-2'>
                    <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='p-1 mt-4'>
                        <div onClick={upVoteHandle} className={`flex justify-center items-center hover:bg-gray-300 ${savedAnswer?.votes.upVote.userId.includes(userData?._id) && 'text-green-600'} rounded-md py-1 text-lg`}>
                            <UpVote />
                        </div>
                        <div className='flex justify-center items-center text-lg'>
                            {savedAnswer?.votes && savedAnswer?.votes?.upVote?.count - savedAnswer?.votes?.downVote?.count}
                        </div>
                        <div onClick={downVoteHandle} className={`flex justify-center items-center hover:bg-gray-300 ${savedAnswer?.votes.downVote.userId.includes(userData?._id) && 'text-red-600'} rounded-md py-1 text-lg`}>
                            <DownVote />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-full mr-12 my-3'>
                    <div className='mt-[1px]'>
                        <div className='flex items-center ml-1 text-base font-medium'>{savedAnswer?.author?.name}</div>
                        <div className='flex items-center ml-1 text-sm'>{savedAnswer?.author?.userName}</div>
                    </div>
                    <div className='mt-4'>
                        <div className='pr-1.5 mb-3 hover:bg-gray-100 hover:rounded-lg ml-2' onClick={answerNavigateHandle}>
                            <pre className='whitespace-pre-wrap font-sans'>{savedAnswer?.answer}</pre>
                        </div>
                        <div className='flex justify-start'>
                            {save ?
                                <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer text-green-700' onClick={handleUnsaveAnswer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                                    </svg>

                                    <button className='ml-1 text-sm font-medium '>Saved</button>
                                </div>
                                :
                                <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5 cursor-pointer' onClick={handleSaveAnswer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                    </svg>
                                    <button className='ml-1 text-sm font-medium '>Save</button>
                                </div>
                            }
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5' onClick={handleShareAnswer}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className='w-5 h-5'>
                                    <path fill="currentColor" d="m237.66 106.35l-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91c-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z"></path>
                                </svg>
                                <button className='ml-1 text-sm font-medium '>Share</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
