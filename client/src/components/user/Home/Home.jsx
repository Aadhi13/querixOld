import jwtDecode from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react'
import { useActionData } from 'react-router-dom'
import axios from "../../../api/axios";
import { DownVote, DropDown, Media, UpVote } from '../../../assets/icons/Icons';

function Home() {
    const [input, setInput] = useState({
        title: '',
        question: ''
    });
    const [data, setData] = useState('');
    const [tag, setTag] = useState('');
    const [tags, setTags] = useState([]);
    const [rows, setRows] = useState(1);
    const textAreaRef = useRef(null);
    const [loader, setLoader] = useState(false);


    //To check if user is logged in by verifying JWT token and getting user's data(name, username, email);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('user');
                if (!token) {
                    setData('');
                    return;
                }
                const response = await axios.get(`/users/${token}`);
                setData(response.data.data);
            } catch (err) {
                console.log(err.response.data.message)
                console.log(err.message)
                if (err.response.data.message == 'Invalid jwt token.') {
                    setData('');
                    localStorage.removeItem('user');
                } else if (err.response.data.message == 'Jwt expired.') {
                    setData('');
                    localStorage.removeItem('user');
                }
            }
        }
        fetchData();
    }, [])



    //Submiting Question 

    const questionSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            const response = await axios.post('')

        } catch (err) {
            console.log(err.message);
            console.log(err.code);
        }
    }



    //To handle the textarea growing feature and changing input.question (increasing the rows when line breaks occuring in all possible ways)

    const texAreaHandleInput = (e) => {
        setInput({ ...input, question: e.target.value });
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
        setInput({...input, title: e.target.value});
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
            <div className='mx-72'>

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
                        <div>
                            <div className='flex justify-center items-center font-semibold text-xl my-3'><input onInput={titleHandleInput} placeholder='Title for your question?' type="text" className='w-[98%] text-xl font-semibold outline-none' /></div>
                            <form>
                                <div className='flex justify-center items-center'>
                                    <textarea placeholder='Curious about something?' ref={textAreaRef} className='overflow-hidden pr-1.5 mb-3 w-[98%] outline-none text-base' onInput={texAreaHandleInput} rows={rows} value={input.question}></textarea>
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
                            <div onClick={questionSubmit} className='flex justify-center items-center bg-profileBtBg hover:bg-profileBt cursor-pointer rounded-2xl mr-6 py-1 px-4 font-medium text-lg'>Submit</div>
                        </div>
                    </div>
                </div>

                {/* Questions */}

                <div className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4'>
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
                                -5
                            </div>
                            <div className='flex justify-center items-center hover:text-red-600 text-lg'>
                                <DownVote />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col pb-3'>
                        <div className='mt-2.5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>Arun D Ayyankave</div>
                            <div className='flex items-center ml-1 text-sm '>@arund7</div>
                        </div>
                        <div className=''>
                            <div className='font-semibold text-xl my-3'>Where can i host a node custom package?</div>
                            <div className='pr-1.5 mb-3'>Oh, Casemiro, what's happened to you? It's like his confidence has gone missing, maybe left behind with those two red cards he got earlier.
                                He's just a shadow of the dominant player he was in the mid-season period. Here's hoping he finds his groove again soon</div>
                        </div>
                        <div className='flex justify-start items-center mb-3'>
                            <div className='mr-2 bg-sky-100 py-0.5 px-1.5 rounded-md text-sm text-sky-700'>JavaScript</div>
                            <div className='mr-2 bg-sky-100 py-0.5 px-1.5 rounded-md text-sm text-sky-700'>Npm</div>
                            <div className='mr-2 bg-sky-100 py-0.5 px-1.5 rounded-md text-sm  text-sky-700'>Advanced</div>
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
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                    </svg>
                                </div>
                                <div className='ml-1 text-sm font-medium'>Save</div>
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

                <div className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4'>
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
                                13
                            </div>
                            <div className='flex justify-center items-center hover:text-red-600 text-lg'>
                                <DownVote />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col pb-3'>
                        <div className='mt-2.5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>Akhin T</div>
                            <div className='flex items-center ml-1 text-sm '>@akhint890</div>
                        </div>
                        <div className=''>
                            <div className='font-semibold text-xl my-3'>How to wright better REGEX?</div>
                            <div className='pr-1.5 mb-3'>Oh, Casemiro, what's happened to you? It's like his confidence has gone missing, maybe left behind with those two red cards he got earlier.
                                He's just a shadow of the dominant player he was in the mid-season period. Here's hoping he finds his groove again soon</div>
                        </div>
                        <div className='flex justify-start items-center mb-3'>
                            <div className='mr-2 bg-sky-100 py-0.5 px-1.5 rounded-md text-sm text-sky-700'>Regex</div>
                            <div className='mr-2 bg-sky-100 py-0.5 px-1.5 rounded-md text-sm text-sky-700'>Pattern</div>
                            <div className='mr-2 bg-sky-100 py-0.5 px-1.5 rounded-md text-sm  text-sky-700'>Difficulta</div>
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
                            <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                    </svg>
                                </div>
                                <div className='ml-1 text-sm font-medium'>Save</div>
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

                <div className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4'>
                    <div className='p-2'>
                        <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className='flex flex-col pb-3'>
                        <div className='mt-2.5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>Abdul Vahid</div>
                            <div className='flex items-center ml-1 text-sm '>@avkp777</div>
                        </div>
                        <div className=''>
                            <div className='font-semibold text-xl my-3'>Heading of this question?</div>
                            <div className='pr-1.5'>Oh, Casemiro, what's happened to you? It's like his confidence has gone missing, maybe left behind with those two red cards he got earlier.
                                He's just a shadow of the dominant player he was in the mid-season period. Here's hoping he finds his groove again soon</div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4'>
                    <div className='p-2'>
                        <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className='flex flex-col pb-3'>
                        <div className='mt-2.5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>Arun D Ayyankave</div>
                            <div className='flex items-center ml-1 text-sm '>@arund7</div>
                        </div>
                        <div className=''>
                            <div className='font-semibold text-xl my-3'>Where can i host a node custom package?</div>
                            <div className='pr-1.5'>Oh, Casemiro, what's happened to you? It's like his confidence has gone missing, maybe left behind with those two red cards he got earlier.
                                He's just a shadow of the dominant player he was in the mid-season period. Here's hoping he finds his groove again soon</div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4'>
                    <div className='p-2'>
                        <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className='flex flex-col pb-3'>
                        <div className='mt-2.5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>Akhin T</div>
                            <div className='flex items-center ml-1 text-sm '>@akhint890</div>
                        </div>
                        <div className=''>
                            <div className='font-semibold text-xl my-3'>How to wright better REGEX?</div>
                            <div className='pr-1.5'>Oh, Casemiro, what's happened to you? It's like his confidence has gone missing, maybe left behind with those two red cards he got earlier.
                                He's just a shadow of the dominant player he was in the mid-season period. Here's hoping he finds his groove again soon</div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4'>
                    <div className='p-2'>
                        <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className='flex flex-col pb-3'>
                        <div className='mt-2.5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>Abdul Vahid</div>
                            <div className='flex items-center ml-1 text-sm '>@avkp777</div>
                        </div>
                        <div className=''>
                            <div className='font-semibold text-xl my-3'>Heading of this question?</div>
                            <div className='pr-1.5'>Oh, Casemiro, what's happened to you? It's like his confidence has gone missing, maybe left behind with those two red cards he got earlier.
                                He's just a shadow of the dominant player he was in the mid-season period. Here's hoping he finds his groove again soon</div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4'>
                    <div className='p-2'>
                        <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className='flex flex-col pb-3'>
                        <div className='mt-2.5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>Arun D Ayyankave</div>
                            <div className='flex items-center ml-1 text-sm '>@arund7</div>
                        </div>
                        <div className=''>
                            <div className='font-semibold text-xl my-3'>Where can i host a node custom package?</div>
                            <div className='pr-1.5'>Oh, Casemiro, what's happened to you? It's like his confidence has gone missing, maybe left behind with those two red cards he got earlier.
                                He's just a shadow of the dominant player he was in the mid-season period. Here's hoping he finds his groove again soon</div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row border-gray-300 border mx-56 rounded-lg mb-4'>
                    <div className='p-2'>
                        <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className='flex flex-col pb-3'>
                        <div className='mt-2.5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>Akhin T</div>
                            <div className='flex items-center ml-1 text-sm '>@akhint890</div>
                        </div>
                        <div className=''>
                            <div className='font-semibold text-xl my-3'>How to wright better REGEX?</div>
                            <div className='pr-1.5'>Oh, Casemiro, what's happened to you? It's like his confidence has gone missing, maybe left behind with those two red cards he got earlier.
                                He's just a shadow of the dominant player he was in the mid-season period. Here's hoping he finds his groove again soon</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home