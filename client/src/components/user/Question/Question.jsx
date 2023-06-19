import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DownVote, DropDown, Media, UpVote } from '../../../assets/icons/Icons';
import Answer from '../Answers/Answer';
import { useParams } from 'react-router-dom';
import axios from '../../../api/axios';
import { useSelector } from 'react-redux';


//need to fetch this answers from database
const answers = [
    {
        id: 'answer1',
        author: {
            id: 'user1',
            name: 'Adhil Ameen',
            userName: 'adhil6'
        },
        body: 'The answer is 6.020294',
        comments: [
            {
                id: 'comment1',
                author: {
                    id: 'user10',
                    name: 'Abdul Vahid',
                    userName: 'avkp333'
                },
                body: 'How?',
                comments: [
                    {
                        id: 'comment31',
                        author: {
                            id: 'user1',
                            name: 'Adhil Ameen',
                            userName: 'adhil6'
                        },
                        body: 'Because, 1/0==true',
                        comments: [
                            {
                                id: 'comment34331',
                                author: {
                                    id: 'user1',
                                    name: 'Adhil Ameen',
                                    userName: 'adhil6'
                                },
                                body: 'I am vahid',
                            }
                        ]
                    }]
            },
            {
                id: 'comment2',
                author: {
                    id: 'user15',
                    name: 'Arun Ayyankav',
                    userName: 'arun81'
                },
                body: 'Nice answer, Thank you for answering',
                comments: [
                    {
                        id: 'comment90',
                        author: {
                            id: 'user344',
                            name: 'Anurag MK',
                            userName: 'anu555'
                        },
                        body: 'This answer is not correct according to new MD%5 algorithem'
                    }]
            },]
    },
    {
        id: 'answer2',
        author: {
            id: 'user123',
            name: 'Arun Ayyankave',
            userName: 'Arunodayam'
        },
        body: 'The answer is not defined',
        comments: [
            {
                id: 'comment555',
                author: {
                    id: 'user10',
                    name: 'Abdul Vahid',
                    userName: 'avkp333'
                },
                body: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, porro tempora id quae cumque vero praesentium modi odit 
                numquam libero maxime, reiciendis veniam repellat? Expedita ipsa ullam ad voluptatem reprehenderit.`,
            }
        ]
    },
    {
        id: 'answer234',
        author: {
            id: 'user2323',
            name: 'Bruce Wayne',
            userName: 'bat6man'
        },
        body: 'Heloo world I am new here how can i comment to a question.',
        comments: [
            {
                id: 'comment34555',
                author: {
                    id: 'user10',
                    name: 'Abdul Vahid',
                    userName: 'avkp333'
                },
                body: '1234132432?',
            }
        ]
    }
]

function Question() {

    const { id } = useParams()
    const [answersData, setAnswersData] = useState(answers);
    const [question, setQuestion] = useState({});
    const [vote, setVote] = useState(0);
    const initialVoteCount = question.votes && question.votes.upVote.count - question.votes.downVote.count;
    const [voteCount, setVoteCount] = useState(initialVoteCount);
    const [input, setInput] = useState('')
    const [rows, setRows] = useState(4);
    const [loader, setLoader] = useState(false);
    const textAreaRef = useRef(null);
    const userData = useSelector((state) => state.userData.userData);
    const fakeData = {
        _id: '',
        name: '',
        username: '',
        email: ''
    }



    useEffect(() => {
        if (question.votes && question.votes.upVote.userId.includes(userData ? userData._id : fakeData._id)) {
            setVoteCount(question.votes.upVote.count - question.votes.downVote.count)
            setVote(1);
        } else if (question.votes && question.votes.downVote.userId.includes(userData ? userData._id : fakeData._id)) {
            setVoteCount(question.votes.upVote.count - question.votes.downVote.count)
            setVote(-1);
        }
    }, [question])



    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/question-data/${id}`);
            setQuestion(response.data.singleQuestionData)
        };
        fetchData();
    }, [id])


    //Tostify

    const showToastMessage = (type) => {
        if (type == 'noUser') {
            toast.error('Please login to vote question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'noUserSave') {
            toast.error('Please login to save question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'linkCopied') {
            toast.success('Link copied to clipboard.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        }
    };


    //Hangle upVoting question

    const upVoteHandle = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUser')
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


    //Hangle downVoting question

    const downVoteHandle = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            showToastMessage('noUser')
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


    //To handle the textarea growing feature and changing input.body (increasing the rows when line breaks occuring in all possible ways)

    const texAreaHandleInput = (e) => {
        setInput(e.target.value);
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
                    console.log('Question saved');
                }
            } catch (err) {
                if (!err?.response) {
                    console.log('No server response');
                } else if (err.code === "ERR_NETWORK") {
                    console.log(err.message);
                } else if (err.response.data.message == 'User not found.') {
                    console.log('User not found');
                } else if (err.response.data.message == "Internal server error.") {
                    console.log('Inernal server error');
                } else {
                    console.log('Something went wrong.');
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
    const handleAnswerSubmit = () => {

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
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                </div>
                                <div className='ml-1 text-sm font-medium'>12 Comments</div>
                            </div>
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </div>
                                <div className='ml-1 text-sm font-medium'>45 Answers</div>
                            </div>
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5' onClick={handleSaveQuestion}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                </svg>
                                <button className='ml-1 text-sm font-medium '>Save</button>
                            </div>
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5' onClick={handleShareQuestion}>
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
                                    {/* The textarea aka Input boxes for asking questions */}
                                    <div>
                                        <form>
                                            <div className='flex justify-center items-center'>
                                                <textarea placeholder='Type your answer' ref={textAreaRef} className='overflow-hidden pr-1.5 mb-3 w-[98%] outline-none text-base' onInput={texAreaHandleInput} rows={rows} value={input}></textarea>
                                                <br />
                                            </div>
                                        </form>
                                    </div>
                                    <div className='flex justify-center mr-6 ml-0.5 items-center border-b border-gray-400 mt-3'></div>
                                    <div className='flex justify-between items-center mt-3'>
                                        <div className='flex justify-center items-center mr-6 py-1 px-4 font-medium text-lg'>
                                            <button onClick={handleAnswerSubmit} disabled={!input} className='disabled:opacity-50 disabled:hover:bg-gray-400 bg-gray-400 hover:bg-profileBt rounded-2xl mr-6 py-1 px-4 font-medium text-lg'>
                                                {!loader ? 'Submit' : 'Submiting...'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div> :
                            <div className='py-4 mb-3 text-lg font-semibold'>Login to answer question <span className='text-blue-500'>Sign In</span></div>
                        }
                        {/* Here we are going to map the Answer component so there would be N number of answers with their own states. */}
                        {answers && answers.map((answer, index) => (
                            <Answer key={answer.id} answer={answer} index={index} />
                        ))}

                    </div>
                </div>

            </div>
        </>
    )
}

export default Question