import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useActionData } from 'react-router-dom'
import axios from "../../../api/axios";
import { useSelector, useDispatch } from 'react-redux';
import { getUserData, logout } from '../../../redux/features/user/userDataSlice';
import { menuHide } from '../../../redux/features/user/menuSlice';
import SpinningWheel, { DownVote, DropDown, Media, UpVote } from '../../../assets/icons/Icons';
import QuestionHome from './QuestionHome';
import { MdWidthFull } from 'react-icons/md';

const INPUT_REGEX = /[^\s\n]/;

function Home() {
    const [input, setInput] = useState({
        title: '',
        body: '',
    });
    const [validInput, setValidInput] = useState({
        title: false,
        body: false
    })
    const [tag, setTag] = useState('');
    const [tags, setTags] = useState([]);
    const [rows, setRows] = useState(1);
    const [loader, setLoader] = useState(false);

    const [questionsData, setQuestionsData] = useState([])
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(0)
    const observer = useRef()

    const lastQuestionRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const textAreaRef = useRef(null);
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userData.userData);
    const fakeData = {
        _id: '',
        name: '',
        username: '',
        email: ''
    }



    //To check if user is logged in by verifying JWT token and getting user's data(name, username, email);

    useEffect(() => {
        dispatch(getUserData());
    }, [])



    //To get question data 
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await axios.get("/questions-data", { params: { page: pageNumber } });
            const updatedQuestionsData = [...questionsData, ...response.data.questionsData];
            setQuestionsData(updatedQuestionsData);
            setHasMore(response.data.questionsCount > updatedQuestionsData.length);
            setLoading(false);
        };
        fetchData();
    }, [pageNumber])



    //Tostify

    const showToastMessage = (type) => {
        if (type == 'success') {
            toast.success('Succefully submitted question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'noUser') {
            toast.error('Please login to submit question.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else if (type == 'unfinished') {
            toast.warn('Complete question to submit', {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };



    //Submiting Question 

    const questionSubmit = async (e) => {
        if (!input.title || !input.body || !validInput.title || !validInput.body) {
            return;
        }
        e.preventDefault();
        try {
            setLoader(true);
            const token = localStorage.getItem('user')
            if (!token) {
                setInput({
                    title: '',
                    body: '',
                });
                setTags([]);
                showToastMessage('noUser')
                setLoader(false);
                return;
                //Can't submit question. Please login again.
            }
            const response = await axios.post('/add-question', { input, tags }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                withCredentials: true
            });

            if (response.data.message == 'Question submitted.') {
                setInput({
                    title: '',
                    body: '',
                });
                setTags([]);
                showToastMessage('success');
                setLoader(false);
                window.location.reload(false);
            }
            setLoader(false);
        } catch (err) {
            if (err == 'no token') {
                setInput({
                    title: '',
                    body: '',
                });
                setTags([]);
                showToastMessage('noUser')
                setLoader(false);
                //Can't submit question. Please login again.
            } else if (err.response.data.message == 'No user found.') {
                setInput({
                    title: '',
                    body: '',
                });
                setTags([]);
                showToastMessage('noUser')
                setLoader(false);
                //Can't submit question. Please login again.
            } else if (err.response.data.message == 'Queston is not complete.') {
                showToastMessage('unfinished')
                setLoader(false);
                //Can't submit unfinished question. Type both the tilte and your question.
            } else if (err.response.data.message === 'no token') {
                setInput({
                    title: '',
                    body: '',
                });
                setTags([]);
                showToastMessage('noUser')
                setLoader(false);
                //Can't submit question. Please login again.
            }
            setLoader(false);
        }
    }



    //To handle the textarea growing feature and changing input.body (increasing the rows when line breaks occuring in all possible ways)

    const texAreaHandleInput = (e) => {
        setInput({ ...input, body: e.target.value });
        const result = INPUT_REGEX.test(e.target.value);
        setValidInput({ ...validInput, body: result });
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
        setRows(nLines);
    }



    //To handle question title input

    const titleHandleInput = (e) => {
        e.preventDefault();
        setInput({ ...input, title: e.target.value });
        const result = INPUT_REGEX.test(e.target.value);
        setValidInput({ ...validInput, title: result });
    };



    //To handle everything related tags input 

    const tagHandleChange = (e) => {
        setTag(e.target.value);
    }

    const tagHandleKyeDown = (e) => {
        const newTag = tag.trim();

        if ((e.key == ',' || e.key == 'Enter' || e.key == 'Tab') && newTag.length && !tags.includes(newTag)) {
            e.preventDefault();
            setTags(prevTags => [...prevTags, newTag]);
            setTag('');
        } else if (e.key == 'Backspace' && !newTag.length && tags.length) {
            e.preventDefault();
            const tagsCopy = [...tags];
            const lastTag = tagsCopy.pop();
            setTags(tagsCopy);
            setTag(lastTag);
        }
    }

    const removeTag = (index) => setTags(prevTags => prevTags.filter((tag, i) => i !== index))


    return (
        <>
            <div className='mx-72' onClick={() => dispatch(menuHide())}>

                {/* Asking questions */}
                <div className='flex flex-row border-gray-400 border mx-56 rounded-lg mb-4'>
                    <div className='p-2 flex flex-col items-center'>
                        <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className='flex flex-col pb-3 w-full'>
                        <div className='mt-2.5 flex justify-start items-center'>
                            <div className='flex items-center justify-center rounded-3xl border-black border pl-3 pr-1 text-sm font-medium'>Everyone <DropDown className='w-7 h-auto' /></div>
                        </div>
                        {/* The textarea aka Input boxes for asking questions */}
                        <div>
                            <div className='flex justify-center items-center font-semibold text-xl my-3'><input onInput={titleHandleInput} value={input.title} placeholder='Title for your question?' type="text" className='w-[98%] text-xl font-semibold outline-none' /></div>
                            <form>
                                <div className='flex justify-center items-center'>
                                    <textarea placeholder='Curious about something?' ref={textAreaRef} className='overflow-hidden pr-1.5 mb-3 w-[98%] outline-none text-base' onInput={texAreaHandleInput} rows={rows} value={input.body}></textarea>
                                    <br />
                                </div>
                            </form>
                        </div>
                        <div className='flex items-center box-border'>
                            {tags.map((tag, index) => (
                                <div key={index} className='rounded-md inline-flex justify-between items-center relative cursor-default bg-sky-100 mx-1 h-6 text-sky-700'>
                                    <span className='block overflow-hidden whitespace-nowrap text-ellipsis text-sm py-0.5 px-1.5'>{tag}</span>
                                    <button className='flex justify-center items-center cursor-pointer text-center text-xl px-1 relative rounded-e-md rounded-s-sm h-[100%] bg-sky-300 hover:bg-sky-400' onClick={() => removeTag(index)}>&times;</button>
                                </div>
                            ))}
                            {tags.length != 5 ?

                                tags.length ?
                                    <input className='w-[58%] outline-none ' type="text"
                                        value={tag} onChange={tagHandleChange} onKeyDown={tagHandleKyeDown} /> :
                                    <input className='w-[58%] outline-none ' type="text"
                                        placeholder='Add up to 5 tags' value={tag} onChange={tagHandleChange} onKeyDown={tagHandleKyeDown} />
                                : null
                            }
                        </div>
                        <div className='flex justify-center mr-6 ml-0.5 items-center border-b border-gray-400 mt-3'></div>
                        <div className='flex justify-between items-center mt-3'>
                            <div><Media className='cursor-pointer p-1.5 w-8 rounded-md h-8 ml-4 hover:bg-gray-300' /></div>
                            {/* <div onClick={questionSubmit} className='flex justify-center items-center bg-profileBtBg hover:bg-profileBt cursor-pointer rounded-2xl mr-6 py-1 px-4 font-medium text-lg'>{!loader?'Submit':'Submiting...'}</div> */}
                            <div className='flex justify-center items-center mr-6 py-1 px-4 font-medium text-lg'>
                                <button onClick={questionSubmit} disabled={!input.title || !input.body || !validInput.title || !validInput.body} className='disabled:opacity-50 disabled:hover:bg-gray-400 bg-gray-400 hover:bg-profileBt rounded-2xl mr-6 py-1 px-4 font-medium text-lg'>
                                    {!loader ? 'Submit' : 'Submiting...'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <ToastContainer />

                {/* Questions */}


                {questionsData && questionsData.map((question, index) => (
                    (Math.floor(questionsData.length * 0.75) === index + 1) ?
                        <QuestionHome ref={lastQuestionRef} index={index} question={question} key={question._id} userData={userData ? userData : fakeData} /> :
                        <QuestionHome index={index} question={question} key={question._id} userData={userData ? userData : fakeData} />
                ))}

                {loading &&
                    <div className='flex justify-center items-center mx-56 rounded-lg my-20`'>
                        <SpinningWheel height={"1.5em"} width={"1.5em"} />
                    </div>
                }
            </div >
        </>
    )
}

export default Home