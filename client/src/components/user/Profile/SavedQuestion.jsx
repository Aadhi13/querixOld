import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { DownVote, UpVote } from '../../../assets/icons/Icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

export default function SavedQuestion(props) {

    const { savedQuestion, onUpdate } = props;
    const [save, setSave] = useState(false);
    const userData = useSelector((state) => state.userData.userData)
    const navigate = useNavigate();

    useEffect(() => {
        console.log("We are at Saved Question component");
    }, [])


    useEffect(() => {
        if (userData?.savedQuestions?.includes(savedQuestion?._id)) {
            setSave(true)
        }
    }, [savedQuestion, userData])


    const showToastMessage = (type) => {
        if (type == 'noUserVote') {
            toast.error('Please login to vote question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'noUserSave') {
            toast.error('Please login to save question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'noUserReportQuestion') {
            toast.error('Please login to report a question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'questionSaveSuccess') {
            toast.success('Question saved.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        } else if (type == 'questionUnsaveSuccess') {
            toast.success('Question unsaved.', {
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
        } else if (type == 'successReportQuestion') {
            toast.success('Question successfully reported.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'warningReportQuestion') {
            toast.warning('Question is already reported by this user.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'invalidReportQuestion') {
            toast.error(`Something went wrong. Can't find question.`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        }
    }


    //Handle share question
    const handleShareQuestion = () => {
        showToastMessage('linkCopied')
        navigator.clipboard.writeText(window.location.origin + '/question/' + savedQuestion._id)
    }

    //Navigate to single queston page when user clicks on questions
    const singleQuestionPageHandle = () => {
        navigate(`/question/${savedQuestion._id}`, { state: { isAnswer: true } })
    }

    const upVoteHandle = async () => {

        let vote;
        const userId = await savedQuestion?.votes.upVote.userId
        if (userId.includes(userData._id)) {
            vote = 1;
            console.log('its a upVote', vote);
        } else if (savedQuestion.votes.downVote.userId.includes(userData._id)) {
            vote = -1;
            console.log('Its a downVote', vote);
        } else {
            vote = 0;
            console.log('Its neutral', vote);
        }

        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserVote')
        } else {
            //Update state 
            if (vote == -1 || vote == 0) {
                const response = await axios.put("/question-vote", { voteIs: 'upVote', questionId: savedQuestion._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                onUpdate()
            } else if (vote == 1) {
                const response = await axios.put("/question-vote", { voteIs: 'neutral', questionId: savedQuestion._id }, {
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
        const userId = await savedQuestion?.votes.upVote.userId
        if (userId.includes(userData._id)) {
            vote = 1;
            console.log('its a upVote', vote);
        } else if (savedQuestion.votes.downVote.userId.includes(userData._id)) {
            vote = -1;
            console.log('Its a downVote', vote);
        } else {
            vote = 0;
            console.log('Its neutral', vote);
        }

        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserVote')
        } else {
            //Update state
            if (vote == 1 || vote == 0) {
                const response = await axios.put("/question-vote", { voteIs: 'downVote', questionId: savedQuestion._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                onUpdate()
            } else if (vote == -1) {
                const response = await axios.put("/question-vote", { voteIs: 'neutral', questionId: savedQuestion._id }, {
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


    //Handle save questoin
    const handleSaveQuestion = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserSave')
        } else {
            try {
                const response = await axios.put("/question-save", { questionId: savedQuestion._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                if (response.data.message == 'Question successfully saved.') {
                    showToastMessage('questionSaveSuccess')
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
    const handleUnsaveQuestion = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            return;
        } else {
            try {
                const response = await axios.put("/question-unsave", { questionId: savedQuestion._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                if (response.data.message == 'Question successfully unsaved.') {
                    showToastMessage('questionUnsaveSuccess')
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

        <>
            <ToastContainer />
            <div className={`flex flex-row border-gray-300 ${savedQuestion.blockStatus ? 'bg-red-100' : null} border rounded-lg`} >
                <div className='p-2'>
                    <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='p-1 mt-4'>
                        <div onClick={upVoteHandle} className={`flex justify-center items-center hover:bg-gray-300 ${savedQuestion?.votes.upVote.userId.includes(userData?._id) && 'text-green-600'} rounded-md py-1 text-lg`}>
                            <UpVote />
                        </div>
                        <div className='flex justify-center items-center text-lg'>
                            {savedQuestion?.votes && savedQuestion?.votes?.upVote?.count - savedQuestion?.votes?.downVote?.count}
                        </div>
                        <div onClick={downVoteHandle} className={`flex justify-center items-center hover:bg-gray-300 ${savedQuestion?.votes.downVote.userId.includes(userData?._id) && 'text-red-600'} rounded-md py-1 text-lg`}>
                            <DownVote />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col pb-3 w-full' >
                    <div className='mt-2.5'>
                        <div className='flex items-center ml-1 text-base  font-medium'>{savedQuestion?.userId?.name}</div>
                        <div className='flex items-center ml-1 text-sm '>@{savedQuestion?.userId.userName}</div>
                    </div>
                    <div className='hover:bg-gray-100 hover:rounded-lg' onClick={singleQuestionPageHandle}>
                        <div className='font-semibold text-xl my-3'>{savedQuestion?.question.title}</div>
                        <div className='pr-4 mb-3'>
                            <pre className='whitespace-pre-wrap font-sans'>{savedQuestion?.question.body}</pre>
                        </div>
                    </div>
                    <div className='flex justify-start items-center mb-3'>
                        {savedQuestion.tags && savedQuestion.tags.map((tag, index) => (
                            <div key={index} className='mr-2 bg-sky-100 py-0.5 px-1.5 rounded-md text-sm text-sky-700 mt-2' >{tag}</div>
                        ))}
                    </div>
                    <div className='flex justify-start '>
                        <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer'>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </div>
                            <button className='ml-1 text-sm font-medium'>{savedQuestion?.answers?.length} Answers</button>
                        </div>
                        <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer'>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                </svg>
                            </div>
                            <button className='ml-1 text-sm font-medium'>{savedQuestion?.comments?.length} Comments</button>
                        </div>
                        {save ?
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer text-green-700' onClick={handleUnsaveQuestion}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                                </svg>

                                <button className='ml-1 text-sm font-medium '>Saved</button>
                            </div>
                            :
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5 cursor-pointer' onClick={handleSaveQuestion}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                </svg>
                                <button className='ml-1 text-sm font-medium '>Save</button>
                            </div>
                        }
                        <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer' onClick={handleShareQuestion}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 256 256">
                                <path fill="currentColor" d="m237.66 106.35l-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91c-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z"></path>
                            </svg>
                            <button className='ml-1 text-sm font-medium '>Share</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
