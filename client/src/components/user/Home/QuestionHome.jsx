import React, { forwardRef, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DownVote, UpVote } from '../../../assets/icons/Icons'
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

const QuestionHome = forwardRef(function QuestionHome(props, ref) {

    const { question, index, userData } = props;
    const [vote, setVote] = useState(0);
    const [voteCount, setVoteCount] = useState(question.votes.upVote.count - question.votes.downVote.count)
    const navigate = useNavigate()

    useEffect(() => {
        if (question.votes.upVote.userId.includes(userData._id)) {
            setVote(1);
        } else if (question.votes.downVote.userId.includes(userData._id)) {
            setVote(-1);
        }
    }, [question])


    //Tostify

    const showToastMessage = (type) => {
        if (type == 'noUserVote') {
            toast.error('Please login to vote question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'noUserSave') {
            toast.error('Please login to save question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'questionSaveSuccess') {
            toast.success('Question saved.', {
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
    };


    const upVoteHandle = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserVote')
        } else {
            //Update state 
            if (vote == -1 || vote == 0) {
                setVote(1)
                const response = await axios.put("/question-vote", { voteIs: 'upVote', questionId: question._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                setVoteCount(response.data.voteCount)
            } else if (vote == 1) {
                setVote(0)
                const response = await axios.put("/question-vote", { voteIs: 'neutral', questionId: question._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                setVoteCount(response.data.voteCount)
            }
        }
    }

    const downVoteHandle = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserVote')
        } else {
            //Update state
            if (vote == 1 || vote == 0) {
                setVote(-1)
                const response = await axios.put("/question-vote", { voteIs: 'downVote', questionId: question._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                setVoteCount(response.data.voteCount)
            } else if (vote == -1) {
                setVote(0)
                const response = await axios.put("/question-vote", { voteIs: 'neutral', questionId: question._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                setVoteCount(response.data.voteCount)
            }
        }
    }


    //Navigate to single queston page when user clicks on questions
    const singleQuestionPageHandle = () => {
        navigate(`/question/${question._id}`, { state: { isAnswer: true } })
    }

    //Handle Comment section or Answer section clicks in questions
    const handleIsAnswerClick = (value) => {
        navigate(`/question/${question._id}`, { state: { isAnswer: value } })
    }


    //Handle save questoin
    const handleSaveQuestion = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserSave')
        } else {
            try {
                const response = await axios.put("/question-save", { questionId: question._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                if (response.data.message == 'Question successfully saved.') {
                    showToastMessage('questionSaveSuccess')
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


    //Handle share question
    const handleShareQuestion = () => {
        showToastMessage('linkCopied')
        navigator.clipboard.writeText(window.location.origin + location.pathname + 'question/' + question._id)
    }

    return (
        <>

            <ToastContainer />

            <div ref={ref} key={question._id} className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4' >
                <div className='p-2'>
                    <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='p-1 mt-4'>
                        <div onClick={upVoteHandle} className={`flex justify-center items-center ${vote == 1 && 'text-green-600'} hover:bg-gray-300 rounded-md py-1 text-lg`}>
                            <UpVote />
                        </div>
                        <div className='flex justify-center items-center text-lg'>
                            {/* {question.votes && question.votes.upVote.count - question.votes.downVote.count} */}
                            {question.votes && voteCount}
                        </div>
                        <div onClick={downVoteHandle} className={`flex justify-center items-center ${vote == -1 && 'text-red-600'} hover:bg-gray-300 rounded-md py-1 text-lg`}>
                            <DownVote />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col pb-3' >
                    <div className='mt-2.5'>
                        <div className='flex items-center ml-1 text-base  font-medium'>{question.userId.name}</div>
                        <div className='flex items-center ml-1 text-sm '>@{question.userId.userName}</div>
                    </div>
                    <div className='hover:bg-gray-100 hover:rounded-lg' onClick={singleQuestionPageHandle}>
                        <div className='font-semibold text-xl my-3'>{question.question.title}</div>
                        <div className='pr-1.5 mb-3'>{question.question.body}</div>
                    </div>
                    <div className='flex justify-start items-center mb-3'>
                        {question.tags && question.tags.map((tag, index) => (
                            <div key={index} className='mr-2 bg-sky-100 py-0.5 px-1.5 rounded-md text-sm text-sky-700' >{tag}</div>
                        ))}
                    </div>
                    <div className='flex justify-start '>
                        <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer' onClick={() => { handleIsAnswerClick(true) }}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </div>
                            <button className='ml-1 text-sm font-medium'>{question?.answers?.length} Answers</button>
                        </div>
                        <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer' onClick={() => { handleIsAnswerClick(false) }}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                </svg>
                            </div>
                            <button className='ml-1 text-sm font-medium'>{question?.comments?.length} Comments</button>
                        </div>
                        <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5 cursor-pointer' onClick={handleSaveQuestion}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                            </svg>
                            <button className='ml-1 text-sm font-medium '>Save</button>
                        </div>
                        <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer' onClick={handleShareQuestion}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 256 256">
                                <path fill="currentColor" d="m237.66 106.35l-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91c-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z"></path>
                            </svg>
                            <button className='ml-1 text-sm font-medium '>Share</button>
                        </div>
                        <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5'>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})

export default QuestionHome