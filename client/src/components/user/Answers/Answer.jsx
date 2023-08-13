import React, { forwardRef, useEffect, useRef, useState } from 'react'
import Comment from '../Comment/Comment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Close, DownVote, Flag, Save, Saved, Share, UpVote } from '../../../assets/icons/Icons'
import axios from '../../../api/axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const INPUT_REGEX = /[^\s\n]/;

const Answer = forwardRef(function Answer(props, ref) {

    const location = useLocation()
    const { answer, index, highliteAnswer, onUpdate } = props;
    const answerRef = useRef();

    const [save, setSave] = useState(false);
    const [vote, setVote] = useState(0);
    const initialVoteCount = answer.votes && answer.votes.upVote.count - answer.votes.downVote.count;
    const [voteCount, setVoteCount] = useState(initialVoteCount);

    const userData = useSelector((state) => state.userData.userData);
    const fakeData = {
        _id: '',
        name: '',
        username: '',
        email: ''
    }

    const textAreaRef = useRef(null);
    const [rows, setRows] = useState(4);
    const [input, setInput] = useState('')
    const [validInput, setValidInput] = useState(false);

    // Ref for the triggering div
    const triggerRef = useRef();

    // State to control whether the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    //To update the vote count in answer and check if user is voted or not

    useEffect(() => {
        if (answer.votes && answer.votes.upVote.userId.includes(userData ? userData._id : fakeData._id)) {
            setVoteCount(answer.votes.upVote.count - answer.votes.downVote.count)
            setVote(1);
        } else if (answer.votes && answer.votes.downVote.userId.includes(userData ? userData._id : fakeData._id)) {
            setVoteCount(answer.votes.upVote.count - answer.votes.downVote.count)
            setVote(-1);
        }

        if (userData?.savedAnswers?.includes(answer?._id)) {
            setSave(true)
        }
    }, [answer])

    //Below useEffect will handle the answer URL. By highliting the answer and scroll down to its place.

    useEffect(() => {
        const currentAnswerId = answerRef.current.id;
        if (highliteAnswer == currentAnswerId) {
            answerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            let origColor = answerRef.current.style.backgroundColor;
            answerRef.current.style.backgroundColor = 'lightYellow';
            setTimeout(function () {
                answerRef.current.style.backgroundColor = origColor;
            }, 1500);
        }
    }, [location.hash, highliteAnswer])


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
        } else if (type == 'noUserUnsave') {
            toast.error('Please login to Unsave answer.', {
                position: toast.POSITION.TOP_CENTER
            });

        } else if (type == 'linkCopied') {
            toast.success('Link copied to clipboard.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'answerSaveSuccess') {
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
        } else if (type == 'successReportAnswer') {
            toast.success('Answer successfully reported.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'answerUnsaveSuccess') {
            toast.success('Asnwer unsaved.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        } else if (type == 'warningReportAnswer') {
            toast.warning('Answer is already reported by this user.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'invalidReportAnswer') {
            toast.error(`Something went wrong. Can't find answer.`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        } else if (type == 'noUserReportAnswer') {
            toast.error('Please login to report a Answer.', {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };


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


    //Handle upVoting answer

    const upVoteHandle = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserVote')
        } else {
            //Update state 
            if (vote == -1 || vote == 0) {
                setVote(1)
                const response = await axios.put("/answer-vote", { voteIs: 'upVote', answerId: answer._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                })
                setVoteCount(response.data.voteCount)
            } else if (vote == 1) {
                setVote(0)
                const response = await axios.put("/answer-vote", { voteIs: 'neutral', answerId: answer._id }, {
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


    //Handle downVoting answer

    const downVoteHandle = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUserVote')
        } else {
            //Update state
            if (vote == 1 || vote == 0) {
                setVote(-1)
                const response = await axios.put("/answer-vote", { voteIs: 'downVote', answerId: answer._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    withCredentials: true
                });
                setVoteCount(response.data.voteCount)
            } else if (vote == -1) {
                setVote(0)
                const response = await axios.put("/answer-vote", { voteIs: 'neutral', answerId: answer._id }, {
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



    //Handle save answer

    const handleSaveAnswer = async () => {
        closeDialog();
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
        closeDialog();
        const token = localStorage.getItem('user');
        if (!token) {
            return;
        } else {
            try {
                const response = await axios.put("/answer-unsave", { answerId: answer._id }, {
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


    //Handle share answer

    const handleShareAnswer = () => {
        closeDialog();
        showToastMessage('linkCopied')
        navigator.clipboard.writeText(window.location.origin + location.pathname + '#' + answer._id)
    }


    //Modal 
    const openDialog = () => {
        setIsModalOpen(true);
        const dialogElement = document.getElementById(`dialog_${answer._id}`);
        if (dialogElement) {
            dialogElement.showModal();
        }
    };

    const openDialog2 = () => {
        closeDialog();
        const dialogElement = document.getElementById(`dialog2_${answer._id}`);
        if (dialogElement) {
            dialogElement.showModal();
        }
    };

    const closeDialog = () => {
        setIsModalOpen(false);
        const dialogElement = document.getElementById(`dialog_${answer._id}`);
        if (dialogElement) {
            dialogElement.close();
        }
    };

    const closeDialog2 = () => {
        const dialogElement = document.getElementById(`dialog2_${answer._id}`);
        if (dialogElement) {
            dialogElement.close();
            setInput('');
            setRows(4);
        }
    };


    //Handle reporting answers

    const handleReportSubmit = async () => {
        console.log('Report =>', answer);
        try {
            setLoading(true);
            const token = localStorage.getItem('user');
            if (!token) {
                setInput('');
                setRows(4);
                showToastMessage('noUserReportAnswer');
                setLoading(false);
                return closeDialog2();
            }

            const response = await axios.post(
                '/report-answer',
                { reason: input, answerId: answer._id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                if (response.data.message === 'Answer successfully reported.') {
                    setInput('');
                    setRows(4);
                    showToastMessage('successReportAnswer');
                    setLoading(false);
                    return closeDialog2();
                } else if (response.data.message === 'Answer is already reported by this user.') {
                    setInput('');
                    setRows(4);
                    showToastMessage('warningReportAnswer');
                    setLoading(false);
                    return closeDialog2();
                }
            } else if (response.status === 409) {
                setInput('');
                setRows(4);
                showToastMessage('warningReportAnswer');
                setLoading(false);
                return closeDialog2();
            }

            setLoading(false);
        } catch (err) {
            if (err === 'no token') {
                console.log(err, 'err');
                setInput('');
                setRows(4);
                showToastMessage('noUserReportAnswer');
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
                showToastMessage('noUserReportAnswer');
                setLoading(false);
            } else if (err.response.data.message == 'Answer is already reported by this user.') {
                setInput('');
                setRows(4);
                showToastMessage('warningReportAnswer');
                setLoading(false);
                return closeDialog2();
            } else if (err.response.data.message == 'Invalid answer.') {
                setInput('');
                setRows(4);
                showToastMessage('invalidReportAnswer');
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
        <>

            <ToastContainer />
            <div ref={ref} key={answer._id} >
                <div className='flex flex-row border-gray-400 border rounded-lg mb-4 bg-sky-50' id={answer._id} ref={answerRef}>
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
                                {voteCount}
                            </div>
                            <div onClick={downVoteHandle} className={`flex justify-center items-center ${vote == -1 && 'text-red-600'} hover:bg-gray-300 rounded-md py-1 text-lg`}>
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
                            <div className='mb-1 ml-1'>
                                <pre className='whitespace-pre-wrap font-sans'>
                                    {answer.answer}  {/* Root answer */}
                                </pre>
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
                                <div ref={triggerRef} className='relative mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer' onClick={openDialog}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <dialog id={`dialog_${answer._id}`} style={modalStyles} className='rounded-lg focus:outline-0 border border-gray-500/75 backdrop:backdrop-blur-[1px] backdrop:bg-gray-100 backdrop:bg-opacity-5'>
                                    <div className='bg-gray-200 py-1.5 w-32 cursor-pointer'>
                                        <div className='px-2 py-1.5 hover:bg-gray-400/40 flex items-center justify-start' onClick={openDialog2}>
                                            <div className='px-1 mr-2 flex items-center justify-center'><Flag width="1.3em" height="1.3em" /></div> <div className='font-[450]'>Report</div>
                                        </div>
                                        {save ?
                                            <div className='px-2 py-1.5 hover:bg-gray-400/40 text-green-700 flex items-center justify-start' onClick={handleUnsaveAnswer}>
                                                <div className='px-1 mr-2 flex items-center justify-center'><Saved width="1.3em" height="1.3em" /></div> <div className='font-[450]'>Saved</div>
                                            </div>
                                            :
                                            <div className='px-2 py-1.5 hover:bg-gray-400/40 flex items-center justify-start' onClick={handleSaveAnswer}>
                                                <div className='px-1 mr-2 flex items-center justify-center'><Save width="1.3em" height="1.3em" /></div> <div className='font-[450]'>Save</div>
                                            </div>
                                        }
                                        <div className='px-2 py-1.5 hover:bg-gray-400/40 flex items-center justify-start' onClick={handleShareAnswer}>
                                            <div className='px-1 mr-2 flex items-center justify-center'><Share width="1.3em" height="1.3em" /></div> <div className='font-[450]'>Share</div>
                                        </div>
                                        <div className='px-2 py-1 hover:bg-red-300/60 flex items-center justify-start' onClick={closeDialog}>
                                            <div className='px-1 mr-2 flex items-center justify-center'><Close width="1.3em" height="1.3em" color="red" /></div> <div className='font-[450] text-red-600'>Cancel</div>
                                        </div>
                                    </div>
                                </dialog>
                                <dialog id={`dialog2_${answer._id}`} style={modalStyles} className='top-[-200px] left-[-100px] rounded-lg focus:outline-0 border border-gray-500/75 backdrop:backdrop-blur-[4px] backdrop:bg-gray-400 backdrop:bg-opacity-20'>
                                    <div className='bg-gray-100 w-[600px]  rounded-lg'>
                                        <header className='bg-slate-200/50 flex flex-row justify-between items-center border-[0.5px] border-b-gray-400 px-4 py-2'>
                                            <div className='text-lg font-bold'>Report <span className='text-blue-600'>@{answer?.author?.userName}'s</span> answer</div>
                                            <div className='px-1 py-1 hover:bg-red-300/60 flex justify-start w-fit rounded-lg -mr-2 cursor-pointer' onClick={closeDialog2}>
                                                <div className='flex justify-center'><Close color="red" width="1.2em" height="1.2em" /></div>
                                            </div>
                                        </header>
                                        <div>
                                            <div className='flex flex-row border-gray-400 borderrounded-lg'>
                                                <textarea placeholder={`Type your reason for reporting @${answer?.author?.userName}'s answer.`}
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
                    </div>
                </div>
            </div>
        </>
    )
})

export default Answer