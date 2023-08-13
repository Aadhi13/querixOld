import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Close, DownVote, Flag, Save, Saved, Share, UpVote } from '../../../assets/icons/Icons'
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

const INPUT_REGEX = /[^\s\n]/;
const QuestionHome = forwardRef(function QuestionHome(props, ref) {

    const { question, index, userData, onUpdate } = props;
    const [vote, setVote] = useState(0);
    const [save, setSave] = useState(false);
    const [voteCount, setVoteCount] = useState(question?.votes.upVote.count - question?.votes.downVote.count);
    const navigate = useNavigate()

    const textAreaRef = useRef(null);
    const [rows, setRows] = useState(4);
    const [input, setInput] = useState('')
    const [validInput, setValidInput] = useState(false);

    // Ref for the triggering div
    const triggerRef = useRef();

    // State to control whether the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(question);
    }, [])

    useEffect(() => {
        if (question.votes.upVote.userId.includes(userData._id)) {
            setVote(1);
        } else if (question.votes.downVote.userId.includes(userData._id)) {
            setVote(-1);
        }

        if (userData?.savedQuestions?.includes(question?._id)) {
            setSave(true)
        }
    }, [question, userData])

    const showToastMessage = (type) => {
        if (type == 'noUserVote') {
            toast.error('Please login to vote question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'noUserSave') {
            toast.error('Please login to save question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'noUserUnsave') {
            toast.error('Please login to Unsave question.', {
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
        if (nLines < 4) {
            setRows(4);
        } else {
            setRows(nLines);
        }
    }



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

    //Handle save questoin
    const handleSaveQuestion = async () => {
        closeDialog();
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
        closeDialog();
        const token = localStorage.getItem('user');
        if (!token) {
            return;
        } else {
            try {
                const response = await axios.put("/question-unsave", { questionId: question._id }, {
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


    //Navigate to single queston page when user clicks on questions
    const singleQuestionPageHandle = () => {
        navigate(`/question/${question._id}`, { state: { isAnswer: true } })
    }


    //Handle Comment section or Answer section clicks in questions
    const handleIsAnswerClick = (value) => {
        navigate(`/question/${question._id}`, { state: { isAnswer: value } })
    }


    //Handle share question
    const handleShareQuestion = () => {
        closeDialog();
        showToastMessage('linkCopied')
        navigator.clipboard.writeText(window.location.origin + location.pathname + 'question/' + question._id)
    }


    //Modal 
    const openDialog = () => {
        setIsModalOpen(true);
        const dialogElement = document.getElementById(`dialog_${question._id}`);
        if (dialogElement) {
            dialogElement.showModal();
        }
    };

    const openDialog2 = () => {
        closeDialog();
        const dialogElement = document.getElementById(`dialog2_${question._id}`);
        if (dialogElement) {
            dialogElement.showModal();
        }
    };

    const closeDialog = () => {
        setIsModalOpen(false);
        const dialogElement = document.getElementById(`dialog_${question._id}`);
        if (dialogElement) {
            dialogElement.close();
        }
    };

    const closeDialog2 = () => {
        const dialogElement = document.getElementById(`dialog2_${question._id}`);
        if (dialogElement) {
            dialogElement.close();
            setInput('');
            setRows(4);
        }
    };

    const handleReportSubmit = async () => {
        console.log('Report =>', question);
        try {
            setLoading(true);
            const token = localStorage.getItem('user');
            if (!token) {
                setInput('');
                setRows(4);
                showToastMessage('noUserReportQuestion');
                setLoading(false);
                return closeDialog2();
            }

            const response = await axios.post(
                '/report-question',
                { reason: input, questionId: question._id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                if (response.data.message === 'Question successfully reported.') {
                    setInput('');
                    setRows(4);
                    showToastMessage('successReportQuestion');
                    setLoading(false);
                    return closeDialog2();
                } else if (response.data.message === 'Question is already reported by this user.') {
                    setInput('');
                    setRows(4);
                    showToastMessage('warningReportQuestion');
                    setLoading(false);
                    return closeDialog2();
                }
            } else if (response.status === 409) {
                setInput('');
                setRows(4);
                showToastMessage('warningReportQuestion');
                setLoading(false);
                return closeDialog2();
            }

            setLoading(false);
        } catch (err) {
            if (err === 'no token') {
                console.log(err, 'err');
                setInput('');
                setRows(4);
                showToastMessage('noUserReportQuestion');
                setLoading(false);
            } else if (err.response?.data.message === 'Internal server error.') {
                showToastMessage('errorServer');
                setLoading(false);
            } else if (
                err.response?.data.message === 'Invalid jwt token.' ||
                err.response?.data.message === 'Jwt expired.' ||
                err.response?.data.message === 'No jwt token.'
            ) {
                setInput('');
                setRows(4);
                showToastMessage('noUserReportQuestion');
                setLoading(false);
            } else if (err.response.data.message == 'Question is already reported by this user.') {
                setInput('');
                setRows(4);
                showToastMessage('warningReportQuestion');
                setLoading(false);
                return closeDialog2();
            } else if (err.response.data.message == 'Invalid question.') {
                setInput('');
                setRows(4);
                showToastMessage('invalidReportQuestion');
                setLoading(false);
                return closeDialog2();
            } else {
                setInput('');
                setRows(4);
                setLoading(false);
            }

            return closeDialog2();
        }
    };



    // Function to calculate the modal position
    const calculateModalPosition = () => {
        const triggerElement = triggerRef.current;
        if (triggerElement) {
            const rect = triggerElement.getBoundingClientRect();
            const top = rect.top + window.scrollY + rect.height;
            const left = rect.left + window.scrollX;
            return { top, left };
        }
        return { top: 0, left: 0 };
    };

    // Inline styles for the modal
    const modalStyles = {
        position: 'absolute',
        zIndex: 999,
        transform: `translate(${calculateModalPosition().left}px, ${calculateModalPosition().top}px)`,
    };

    return (
        <div>
            <ToastContainer />

            <div ref={ref} key={question._id} className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4' >
                <div className='p-2'>
                    <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='p-1 mt-4'>
                        <div onClick={upVoteHandle} className={`flex justify-center items-center hover:bg-gray-300 ${vote == 1 && 'text-green-600'} rounded-md py-1 text-lg`}>
                            <UpVote />
                        </div>
                        <div className='flex justify-center items-center text-lg'>
                            {question?.votes && voteCount}
                        </div>
                        <div onClick={downVoteHandle} className={`flex justify-center items-center hover:bg-gray-300 ${vote == -1 && 'text-red-600'} rounded-md py-1 text-lg`}>
                            <DownVote />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col pb-3 w-full' >
                    <div className='mt-2.5'>
                        <div className='flex items-center ml-1 text-base  font-medium'>{question?.userId.name}</div>
                        <div className='flex items-center ml-1 text-sm '>@{question?.userId.userName}</div>
                    </div>
                    <div className='hover:bg-gray-100 hover:rounded-lg' onClick={singleQuestionPageHandle}>
                        <div className='font-semibold text-xl my-3'>{question?.question.title}</div>
                        <div className='pr-4 mb-3'>
                            <pre className='whitespace-pre-wrap font-sans'>{question?.question.body}</pre>
                        </div>
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
                        <div ref={triggerRef} className='relative mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer' onClick={openDialog}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                            </div>
                        </div>
                        <dialog id={`dialog_${question._id}`} style={modalStyles} className='rounded-lg focus:outline-0 border border-gray-500/75 backdrop:backdrop-blur-[1px] backdrop:bg-gray-100 backdrop:bg-opacity-5'>
                            <div className='bg-gray-200 py-1.5 w-32 cursor-pointer'>
                                <div className='px-2 py-1.5 hover:bg-gray-400/40 flex items-center justify-start' onClick={openDialog2}>
                                    <div className='px-1 mr-2 flex items-center justify-center'><Flag width="1.3em" height="1.3em" /></div> <div className='font-[450]'>Report</div>
                                </div>
                                {save ?
                                    <div className='px-2 py-1.5 hover:bg-gray-400/40 text-green-700 flex items-center justify-start' onClick={handleUnsaveQuestion}>
                                        <div className='px-1 mr-2 flex items-center justify-center'><Saved width="1.3em" height="1.3em" /></div> <div className='font-[450]'>Saved</div>
                                    </div>
                                    :
                                    <div className='px-2 py-1.5 hover:bg-gray-400/40 flex items-center justify-start' onClick={handleSaveQuestion}>
                                        <div className='px-1 mr-2 flex items-center justify-center'><Save width="1.3em" height="1.3em" /></div> <div className='font-[450]'>Save</div>
                                    </div>
                                }
                                <div className='px-2 py-1.5 hover:bg-gray-400/40 flex items-center justify-start' onClick={handleShareQuestion}>
                                    <div className='px-1 mr-2 flex items-center justify-center'><Share width="1.3em" height="1.3em" /></div> <div className='font-[450]'>Share</div>
                                </div>
                                <div className='px-2 py-1 hover:bg-red-300/60 flex items-center justify-start' onClick={closeDialog}>
                                    <div className='px-1 mr-2 flex items-center justify-center'><Close width="1.3em" height="1.3em" color="red" /></div> <div className='font-[450] text-red-600'>Cancel</div>
                                </div>
                            </div>
                        </dialog>
                        <dialog id={`dialog2_${question._id}`} style={modalStyles} className='top-[-200px] left-[-330px] rounded-lg focus:outline-0 border border-gray-500/75 backdrop:backdrop-blur-[4px] backdrop:bg-gray-400 backdrop:bg-opacity-20'>
                            <div className='bg-gray-100 w-[600px]  rounded-lg'>
                                <header className='bg-slate-200/50 flex flex-row justify-between items-center border-[0.5px] border-b-gray-400 px-4 py-2'>
                                    <div className='text-lg font-bold'>Report <span className='text-blue-600'>@{question.userId.userName}'s</span> question</div>
                                    <div className='px-1 py-1 hover:bg-red-300/60 flex justify-start w-fit rounded-lg -mr-2 cursor-pointer' onClick={closeDialog2}>
                                        <div className='flex justify-center'><Close color="red" width="1.2em" height="1.2em" /></div>
                                    </div>
                                </header>
                                <div>
                                    <div className='flex flex-row border-gray-400 borderrounded-lg'>
                                        <textarea placeholder={`Type your reason for reporting @${question.userId.userName}'s question.`}
                                            ref={textAreaRef} className='overflow-hidden py-3 px-4 w-full outline-none text-base'
                                            onInput={texAreaHandleInput} rows={rows} value={input} name='reason'>
                                        </textarea>
                                    </div>
                                </div>
                                <footer className='bg-slate-200/50 flex justify-end items-center py-2'>
                                    <button className='text-gray-600 py-1 rounded-md mr-4 text-sm cursor-pointer hover:text-gray-800' onClick={closeDialog2}>Cancel</button>
                                    <button className='disabled:opacity-50 bg-blue-600 text-white px-2 py-1 font-medium rounded-md mr-5 cursor-pointer disabled:hover:bg-blue-600 hover:bg-blue-700' disabled={!validInput} onClick={handleReportSubmit}>{loading ? 'Submiting...' : 'Submit'}</button>
                                </footer>
                            </div>
                        </dialog>
                    </div>
                </div>
            </div >
        </div>
    )
})

export default QuestionHome