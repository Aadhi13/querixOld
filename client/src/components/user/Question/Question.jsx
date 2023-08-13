import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { SpinningWheel, DownVote, DropDown, Media, UpVote, Close, Share, Save, Flag, Saved } from '../../../assets/icons/Icons';
import Answer from '../Answers/Answer';
import Comment from '../Comment/Comment';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from '../../../api/axios';
import { useSelector } from 'react-redux';
import AnswerInput from '../Answers/AnswerInput';
import CommentInput from '../Comment/CommentInput';


const INPUT_REGEX = /[^\s\n]/;

function Question() {

    const navigate = useNavigate();
    const location = useLocation()
    const { id } = useParams()
    const [answersData, setAnswersData] = useState([]);
    const [highliteAnswer, setHighliteAnswer] = useState('');
    const [commentsData, setCommentsData] = useState([]);
    const [question, setQuestion] = useState({});

    const [vote, setVote] = useState(0);
    const [save, setSave] = useState(false);
    const initialVoteCount = question.votes && question.votes.upVote.count - question.votes.downVote.count;
    const [voteCount, setVoteCount] = useState(initialVoteCount);

    const [isAnswer, setIsAnswer] = useState(location.state ? location.state.isAnswer : true);
    const userData = useSelector((state) => state.userData.userData);
    const fakeData = {
        _id: '',
        name: '',
        username: '',
        email: ''
    }

    const [lastAnswer, setLastAnswer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(0)

    const [lastComment, setLastComment] = useState(false);
    const [loadingComment, setLoadingComment] = useState(false);
    const [hasMoreComment, setHasMoreComment] = useState(false);
    const [pageNumberComment, setPageNumberComment] = useState(0)
    const observer = useRef()

    const [newAnswerCount, setNewAnswerCount] = useState(0);
    const [newCommentCount, setNewCommentCount] = useState(0);

    //Modal
    const textAreaRefModal = useRef(null);
    const [rowsModal, setRowsModal] = useState(4);
    const [inputModal, setInputModal] = useState('')
    const [validInputModal, setValidInputModal] = useState(false);

    // Ref for the triggering div
    const triggerRef = useRef();

    // State to control whether the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    const lastAnswerRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])


    const lastCommentRef = useCallback(node => {
        if (loadingComment) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreComment) {
                setPageNumberComment(prevPageNumberComment => prevPageNumberComment + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingComment, hasMoreComment])


    //To update the vote count in question and check if user is voted or not & saved or not

    useEffect(() => {
        if (question.votes && question.votes.upVote.userId.includes(userData ? userData._id : fakeData._id)) {
            setVoteCount(question.votes.upVote.count - question.votes.downVote.count)
            setVote(1);
        } else if (question.votes && question.votes.downVote.userId.includes(userData ? userData._id : fakeData._id)) {
            setVoteCount(question.votes.upVote.count - question.votes.downVote.count)
            setVote(-1);
        }

        if (userData?.savedQuestions?.includes(question?._id)) {
            setSave(true)
        }
    }, [question])


    //To get the question data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/question-data/${id}`);
                setQuestion(response.data.singleQuestionData)
            } catch (err) {
                if (err.response.data.message == 'Invalid question') {
                    //404 error
                    navigate('*')
                }
            }
        };
        fetchData();
    }, [id])


    //To get answers data 

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await axios.get("/answers-data", { params: { page: pageNumber, questionId: id } });
            const updatedAnswersData = [...answersData, ...response.data.answersData];
            setAnswersData(updatedAnswersData);
            setHasMore(response.data.answersCount > updatedAnswersData.length);
            setLastAnswer(response.data.answersCount == updatedAnswersData.length);
            setLoading(false);
        };
        fetchData()
    }, [pageNumber])


    //To get comments data 

    useEffect(() => {
        const fetchData = async () => {
            setLoadingComment(true);
            const response = await axios.get("/comments-data", { params: { page: pageNumberComment, questionId: id } });
            const updatedCommentsData = [...commentsData, ...response.data.commentsData];
            setCommentsData(updatedCommentsData);
            setHasMoreComment(response.data.commentsCount > updatedCommentsData.length);
            setLastComment(response.data.commentsCount == updatedCommentsData.length);
            setLoadingComment(false);
        };
        fetchData()
    }, [pageNumberComment])


    //Refetch data 

    const reFetchData = async () => {
        setLoading(true);
        const response = await axios.get("/answers-data", { params: { page: pageNumber, questionId: id } });
        const updatedAnswersData = [...response.data.answersData];
        setAnswersData(updatedAnswersData);
        setHasMore(response.data.answersCount > updatedAnswersData.length);
        setLastAnswer(response.data.answersCount == updatedAnswersData.length);
        setNewAnswerCount(prevCount => prevCount + 1)
        setLoading(false);
    };


    //Refetch comment data

    const reFetchDataComment = async () => {
        setLoadingComment(true)
        const response = await axios.get("/comments-data", { params: { page: pageNumberComment, questionId: id } });
        const updatedCommentsData = [...response.data.commentsData];
        setCommentsData(updatedCommentsData);
        setHasMoreComment(response.data.commentsCount > updatedCommentsData.length);
        setLastComment(response.data.commentsCount == updatedCommentsData.length);
        setNewCommentCount(prevCount => prevCount + 1)
        setLoadingComment(false);
    };

    //To refetch data 

    const triggerFetchData = () => {
        // Reset pagination-related state
        setPageNumber(0);
        setAnswersData([]);
        setHasMore(false);

        // Fetch data again
        reFetchData();
    };


    //To refetch comment data 

    const triggerFetchDataComment = () => {
        // Reset pagination-related state
        setPageNumberComment(0);
        setCommentsData([]);
        setHasMoreComment(false);

        // Fetch data again
        reFetchDataComment();
    };


    //Below useEffect will handle the answer url. By finding the answer among the answersData. 
    //And pass it into answer component for highliting the answer and scroll down to its place.

    useEffect(() => {
        const answerId = location.hash.replace("#", ""); //Retrive answerId from url
        if (lastAnswer) {
            if (answersData.some(answer => answer._id === answerId)) {
                setHighliteAnswer(answerId);
            }
        }
        if (highliteAnswer || !answerId || !answersData || !hasMore) {
            return;
        }
        if (answersData.some(answer => answer._id === answerId)) {
            setHighliteAnswer(answerId);
        } else {
            setPageNumber(prevPageNumber => prevPageNumber + 1);
        }
    }, [location.hash, hasMore, answersData, lastAnswer]);


    //Tostify

    const showToastMessage = (type) => {
        if (type == 'noUserVote') {
            toast.error('Please login to vote question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'noUserSave') {
            toast.error('Please login to save question.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'noUserUnsave') {
            toast.error('Please login to Unsave question.', {
                position: toast.POSITION.TOP_CENTER
            });

        } else if (type == 'noUserAnswer') {
            toast.error('Please login to answer question.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'noUserComment') {
            toast.error('Please login to comment question.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
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
        } else if (type == 'unfinishedAnswer') {
            toast.warn('Complete answer to submit', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'unfinishedComment') {
            toast.warn('Complete comment to submit', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'linkCopied') {
            toast.success('Link copied to clipboard.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'successAnswer') {
            toast.success('Answer successfully submitted.', {
                position: toast.POSITION.TOP_CENTER,
            });
        } else if (type == 'successComment') {
            toast.success('Comment successfully submitted.', {
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
    };


    //Handle upVoting question

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


    //Handle downVoting question

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
                });
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


    //To handle the textarea growing feature and changing input (increasing the rows when line breaks occuring in all possible ways)

    const texAreaHandleInputModal = (e) => {
        setInputModal(e.target.value);
        const result = INPUT_REGEX.test(e.target.value);
        setValidInputModal(result);
        const textarea = textAreaRefModal.current;
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
            setRowsModal(4);
        } else {
            setRowsModal(nLines);
        }
    }


    //Handle save question

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
                    showToastMessage('questionSaveSuccess', {
                        toastId: 'saveQuestion'
                    })
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
                    showToastMessage('questionUnsaveSuccess', {
                        toastId: 'UnSaveQuestion'
                    })
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


    //Handle share question

    const handleShareQuestion = () => {
        closeDialog();
        showToastMessage('linkCopied')
        navigator.clipboard.writeText(window.location.origin + location.pathname)
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
            setInputModal('');
            setRowsModal(4);
        }
    };

    const handleReportSubmit = async () => {
        try {
            setLoadingModal(true);
            const token = localStorage.getItem('user');
            if (!token) {
                setInputModal('');
                setRowsModal(4);
                showToastMessage('noUserReportQuestion');
                setLoadingModal(false);
                return closeDialog2();
            }

            const response = await axios.post(
                '/report-question',
                { reason: inputModal, questionId: question._id },
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
                    setInputModal('');
                    setRowsModal(4);
                    showToastMessage('successReportQuestion');
                    setLoadingModal(false);
                    return closeDialog2();
                } else if (response.data.message === 'Question is already reported by this user.') {
                    setInputModal('');
                    setRowsModal(4);
                    showToastMessage('warningReportQuestion');
                    setLoadingModal(false);
                    return closeDialog2();
                }
            } else if (response.status === 409) {
                setInputModal('');
                setRowsModal(4);
                showToastMessage('warningReportQuestion');
                setLoadingModal(false);
                return closeDialog2();
            }

            setLoadingModal(false);
        } catch (err) {
            if (err === 'no token') {
                console.log(err, 'err');
                setInputModal('');
                setRowsModal(4);
                showToastMessage('noUserReportQuestion');
                setLoadingModal(false);
            } else if (err.response?.data.message === 'Internal server error.') {
                showToastMessage('errorServer');
                setLoadingModal(false);
            } else if (
                err.response?.data.message === 'Invalid jwt token.' ||
                err.response?.data.message === 'Jwt expired.' ||
                err.response?.data.message === 'No jwt token.'
            ) {
                setInputModal('');
                setRowsModal(4);
                showToastMessage('noUserReportQuestion');
                setLoadingModal(false);
            } else if (err.response.data.message == 'Question is already reported by this user.') {
                setInputModal('');
                setRowsModal(4);
                showToastMessage('warningReportQuestion');
                setLoadingModal(false);
                return closeDialog2();
            } else if (err.response.data.message == 'Invalid question.') {
                setInputModal('');
                setRowsModal(4);
                showToastMessage('invalidReportQuestion');
                setLoadingModal(false);
                return closeDialog2();
            } else {
                setInputModal('');
                setRowsModal(4);
                setLoadingModal(false);
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
            <div className='mx-72 mt-5'>

                <div className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4'>
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
                                {voteCount ? voteCount : (question.votes && question.votes.upVote.count - question.votes.downVote.count)}
                            </div>
                            <div onClick={downVoteHandle} className={`flex justify-center items-center ${vote == -1 && 'text-red-600'} hover:bg-gray-300 rounded-md py-1 text-lg`}>
                                <DownVote />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col pb-3'>
                        <div className='mt-2.5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>{question.userId?.name}</div>
                            <div className='flex items-center ml-1 text-sm '>@{question.userId?.userName}</div>
                        </div>
                        <div className='mr-4'>
                            <div className='font-semibold text-xl my-3'>{question?.question?.title}</div>
                            <div className='pr-1.5 mb-3'><pre className='whitespace-pre-wrap font-sans'>{question?.question?.body}</pre></div>
                        </div>
                        <div className='flex justify-start items-center mb-3'>
                            {question.tags && question.tags.map((tag, index) => (
                                <div key={index} className='mr-2 bg-sky-100 py-0.5 px-1.5 rounded-md text-sm text-sky-700' >{tag}</div>
                            ))}
                        </div>
                        <div className='flex justify-start '>
                            <div className={`mr-2 flex justify-center items-center ${isAnswer ? 'bg-gray-300' : 'bg-none'} hover:bg-gray-300 rounded-md p-1.5 cursor-pointer`} onClick={() => setIsAnswer(true)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </div>
                                <button className='ml-1 text-sm font-medium'>{question?.answers?.length + newAnswerCount} Answers</button>
                            </div>
                            <div className={`mr-2 flex justify-center items-center ${isAnswer ? 'bg-none' : 'bg-gray-300'} hover:bg-gray-300 rounded-md p-1.5 cursor-pointer`} onClick={() => setIsAnswer(false)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                </div>
                                <button className='ml-1 text-sm font-medium'>{question?.comments?.length + newCommentCount} Comments</button>
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
                                        <div className='text-lg font-bold'>Report <span className='text-blue-600'>@{question?.userId?.userName}'s</span> question</div>
                                        <div className='px-1 py-1 hover:bg-red-300/60 flex justify-start w-fit rounded-lg -mr-2 cursor-pointer' onClick={closeDialog2}>
                                            <div className='flex justify-center'><Close color="red" width="1.2em" height="1.2em" /></div>
                                        </div>
                                    </header>
                                    <div>
                                        <div className='flex flex-row border-gray-400 borderrounded-lg'>
                                            <textarea placeholder={`Type your reason for reporting @${question?.userId?.userName}'s question.`}
                                                ref={textAreaRefModal} className='overflow-hidden py-3 px-4 w-full outline-none text-base'
                                                onInput={texAreaHandleInputModal} rows={rowsModal} value={inputModal} name='reason'>
                                            </textarea>
                                        </div>
                                    </div>
                                    <footer className='bg-slate-200/50 flex justify-end items-center py-2'>
                                        <button className='text-gray-600 py-1 rounded-md mr-4 text-sm cursor-pointer hover:text-gray-800' onClick={closeDialog2}>Cancel</button>
                                        <button className='disabled:opacity-50 bg-blue-600 text-white px-2 py-1 font-medium rounded-md mr-5 cursor-pointer disabled:hover:bg-blue-600 hover:bg-blue-700' disabled={!validInputModal} onClick={handleReportSubmit}>{loadingModal ? 'Submiting...' : 'Submit'}</button>
                                    </footer>
                                </div>
                            </dialog>
                        </div>
                    </div>
                </div>



                {isAnswer ? (
                    <>
                        {/* Answers & Comments */}
                        <div className=''>
                            <h1 className='mx-60 text-3xl font-bold mb-4'>Answers</h1>
                            <div className='mx-56'>

                                {/* Here we are gonna display the input box for answering based on user is logged in or not. */}
                                {userData ?
                                    <AnswerInput userData={userData} question={question} onUpdate={triggerFetchData} />
                                    :
                                    // If the user is not signed in 
                                    <div className='py-4 mb-3 text-lg font-semibold'>To answer question <Link to='/signin' className='text-blue-500 hover:text-blue-700'>Sign In</Link></div>
                                }

                                {/* Here we are going to map the Answer component so there would be N number of answers with their own states. */}
                                {Array.isArray(question.answers) && question.answers.length > 0 ? answersData.map((answer, index) => (
                                    <Answer ref={answersData.length === index + 1 ? lastAnswerRef : null} key={answer._id} answer={answer} index={index} highliteAnswer={highliteAnswer} onUpdate={triggerFetchData} />
                                )) :
                                    //If there is no answers
                                    <div className='text-center text-xl tracking-wide font-semibold mt-12'>Be the first one to answer to <span className='text-linkedin'>{question?.userId?.name}</span>'s question.</div>
                                }

                                {loading &&
                                    <div className='flex justify-center items-center mx-56 rounded-lg my-20`'>
                                        <SpinningWheel height={"1.5em"} width={"1.5em"} />
                                    </div>
                                }

                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Comments */}
                        <div className=''>
                            <h1 className='mx-60 text-3xl font-bold mb-4'>Comments</h1>
                            <div className='mx-56'>

                                {/* Here we are going to display the input box for commenting based on the user is logged in or not. */}
                                {userData ?
                                    <CommentInput userData={userData} question={question} onUpdate={triggerFetchDataComment} />
                                    :
                                    // If the user is not signed in 
                                    <div className='py-4 mb-3 text-lg font-semibold'>To comment question <Link to='/signin' className='text-blue-500 hover:text-blue-700'>Sign In</Link></div>
                                }

                                {/* Here we are going to map the Comment component so there would be N number of Comments with their own states. */}
                                {Array.isArray(question.comments) && question.comments.length > 0 ? commentsData.map((comment, index) => (
                                    <Comment ref={commentsData.length === index + 1 ? lastCommentRef : null} key={comment._id} comment={comment} index={index} onUpdate={triggerFetchData} />
                                )) :
                                    //If there is no comments
                                    <div className='text-center text-xl tracking-wide font-semibold mt-12'>Be the first one to comment to <span className='text-linkedin'>{question?.userId?.name}</span>'s question.</div>
                                }

                                {loadingComment &&
                                    <div className='flex justify-center items-center mx-56 rounded-lg my-20`'>
                                        <SpinningWheel height={"1.5em"} width={"1.5em"} />
                                    </div>
                                }

                            </div>
                        </div>
                    </>
                )}


            </div >
        </>
    )
}

export default Question