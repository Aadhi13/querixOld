import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DownVote, DropDown, Media, UpVote } from '../../../assets/icons/Icons';
import Answer from '../Answers/Answer';
import Comment from '../Comment/Comment';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from '../../../api/axios';
import { useSelector } from 'react-redux';


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
    const initialVoteCount = question.votes && question.votes.upVote.count - question.votes.downVote.count;
    const [voteCount, setVoteCount] = useState(initialVoteCount);

    const [input, setInput] = useState('')
    const [validInput, setValidInput] = useState(false);
    const [commentInput, setCommentInput] = useState('')
    const [validCommentInput, setValidCommentInput] = useState('')

    const [rows, setRows] = useState(2);
    const [rowsComment, setRowsComment] = useState(2);
    const [loader, setLoader] = useState(false);
    const [loaderComment, setLoaderComment] = useState(false);
    const [isAnswer, setIsAnswer] = useState(location.state ? location.state.isAnswer : true);
    const textAreaRef = useRef(null);
    const textAreaRefComment = useRef(null);
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
            if (entries[0].isIntersecting && hasMore) {
                setPageNumberComment(prevPageNumberComment => prevPageNumberComment + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingComment, hasMoreComment])


    //To update the vote count in question and check if user is voted or not

    useEffect(() => {
        if (question.votes && question.votes.upVote.userId.includes(userData ? userData._id : fakeData._id)) {
            setVoteCount(question.votes.upVote.count - question.votes.downVote.count)
            setVote(1);
        } else if (question.votes && question.votes.downVote.userId.includes(userData ? userData._id : fakeData._id)) {
            setVoteCount(question.votes.upVote.count - question.votes.downVote.count)
            setVote(-1);
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
        } else if (type == 'questionSaveSuccess') {
            toast.success('Question saved.', {
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


    //To handle the textarea growing feature and changing comment input (increasing the rows when line breaks occuring in all possible ways)

    const texAreaHandleInputComment = (e) => {
        setCommentInput(e.target.value)
        const result = INPUT_REGEX.test(e.target.value);
        setValidCommentInput(result)
        const textarea = textAreaRefComment.current;
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
            setRowsComment(2);
        } else {
            setRowsComment(nLines);
        }
    }


    //Handle save question

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
        navigator.clipboard.writeText(window.location.origin + location.pathname)
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
                console.log(`no token can't answer question.`);
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
            }
            setLoader(false);
        } catch (err) {
            console.log(err);
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

    //Handle comment submit

    const handleCommentSubmit = async (e) => {
        if (!validCommentInput) {
            return;
        }
        e.preventDefault();
        try {
            setLoaderComment(true);
            const token = localStorage.getItem('user')
            if (!token) {
                console.log(`no token can't comment question.`);
                setCommentInput('');
                setRowsComment(2);
                showToastMessage('noUserComment')
                setLoaderComment(false);
                return;
                //Can't comment question. Please login again.
            }
            const response = await axios.post('/add-comment', { input: commentInput, questionId: question._id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                withCredentials: true
            });

            if (response.data.message == 'Comment submitted.') {
                setCommentInput('');
                setRowsComment(2);
                showToastMessage('successComment');
            }
            setLoaderComment(false);
        } catch (err) {
            console.log(err);
            if (err == 'no token') {
                setCommentInput('');
                setRowsComment(2);
                showToastMessage('noUserComment')
                setLoaderComment(false);
                //Can't submit comment. Please login again.
            } else if (err.response.data.message == 'Comment is not complete.') {
                showToastMessage('unfinishedComment')
                setLoaderComment(false);
                //Can't submit unfinished comment. Fill the input fields.
            } else if (err.response.data.message == 'Invalid jwt token.' || 'Jwt expired.' || 'No user found.' || 'no token' || 'No jwt token.') {
                localStorage.removeItem('user')
                setCommentInput('');
                setRowsComment(2);
                showToastMessage('noUserComment')
                setLoaderComment(false);
                //Can't submit comment. Please login again.
            } else if (err.response.data.message == 'Invalid question.') {
                setCommentInput('');
                setRowsComment(2);
                showToastMessage('noQuestion')
                setLoaderComment(false);
            }
        }
    }




    return (
        <>
            <ToastContainer />
            <div className='mx-72 '>

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
                        <div className=''>
                            <div className='font-semibold text-xl my-3'>{question?.question?.title}</div>
                            <div className='pr-1.5 mb-3'>{question?.question?.body}</div>
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
                                <button className='ml-1 text-sm font-medium'>{question?.answers?.length} Answers</button>
                            </div>
                            <div className={`mr-2 flex justify-center items-center ${isAnswer ? 'bg-none' : 'bg-gray-300'} hover:bg-gray-300 rounded-md p-1.5 cursor-pointer`} onClick={() => setIsAnswer(false)}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                </div>
                                <button className='ml-1 text-sm font-medium'>{question?.comments?.length} Comments</button>
                            </div>
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer' onClick={handleSaveQuestion}>
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
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                {isAnswer ? (
                    <>
                        {/* Answers & Comments */}
                        <div className=''>
                            <h1 className='mx-60 text-3xl font-bold mb-4'>Answers</h1>
                            <div className='mx-56'>

                                {userData ?
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
                                    :
                                    // If the user is not signed in 
                                    <div className='py-4 mb-3 text-lg font-semibold'>Login to answer question <Link to='/signin' className='text-blue-500'>Sign In</Link></div>
                                }

                                {/* Here we are going to map the Answer component so there would be N number of answers with their own states. */}
                                {answersData && answersData.map((answer, index) => (
                                    (Math.floor(answersData.length * 0.75) === index + 1) ?
                                        // (index === answersData.length - 3) ?
                                        <Answer ref={lastAnswerRef} key={answer._id} answer={answer} index={index} highliteAnswer={highliteAnswer} /> :
                                        <Answer key={answer._id} answer={answer} index={index} highliteAnswer={highliteAnswer} />
                                ))}

                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Comments */}
                        <div className=''>
                            <h1 className='mx-60 text-3xl font-bold mb-4'>Comments</h1>
                            <div className='mx-56'>

                                {userData ?
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
                                            {/* The textarea aka Input box for commenting questions */}
                                            <div>
                                                <form>
                                                    <div className='flex justify-center items-center'>
                                                        <textarea placeholder={`Type your comment to ${question.userId?.name}'s question.`} ref={textAreaRefComment} className='overflow-hidden pr-1.5 mb-3 w-[98%] outline-none text-base' onInput={texAreaHandleInputComment} rows={rowsComment} value={commentInput} name='comment'></textarea>
                                                        <br />
                                                    </div>
                                                </form>
                                            </div>
                                            <div className='flex justify-center mr-6 ml-0.5 items-center border-b border-gray-400 mt-3'></div>
                                            <div className='flex justify-between items-center mt-3'>
                                                <div className='flex justify-center items-center mr-6 py-1 px-4 font-medium text-lg'>
                                                    <button onClick={handleCommentSubmit} disabled={!validCommentInput} className='disabled:opacity-50 disabled:hover:bg-gray-400 bg-gray-400 hover:bg-profileBt rounded-2xl mr-6 py-1 px-4 font-medium text-lg'>
                                                        {!loaderComment ? 'Submit' : 'Submiting...'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    // If the user is not signed in 
                                    <div className='py-4 mb-3 text-lg font-semibold'>Login to answer question <Link to='/signin' className='text-blue-500'>Sign In</Link></div>
                                }

                                {/* Here we are going to map the Comment component so there would be N number of Comments with their own states. */}
                                {commentsData && commentsData.map((comment, index) => (
                                    (Math.floor(commentsData.length * 0.75) === index + 1) ?
                                        // (index === commentsData.length - 3) ?
                                        <Comment ref={lastCommentRef} key={comment._id} comment={comment} index={index} /> :
                                        <Comment key={comment._id} comment={comment} index={index} />
                                ))}

                            </div>
                        </div>
                    </>
                )}


            </div>
        </>
    )
}

export default Question