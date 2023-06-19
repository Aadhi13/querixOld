import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom'

function Comment({ comment, index }) {
    const [isReplaying, setIsReplaying] = useState(false)
    const commentInputRef = useRef(null);
    const [commentInput, setCommentInput] = useState('')
    const [rows, setRows] = useState(6);
    const location = useLocation()
    const commentRef = useRef()

    //Below useEffect will handle the comment link. And highlite the comment and scroll down to its place.

    useEffect(() => {
        const hash = location.hash
        console.log('hash', hash)
        const id = '#' + commentRef.current.id;
        if (hash == id) {
            commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            let origColor = commentRef.current.style.backgroundColor;
            commentRef.current.style.backgroundColor = 'lightYellow';
            setTimeout(function () {
                commentRef.current.style.backgroundColor = origColor;
            }, 1500);
        }
    }, [location.hash])


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




    //To handle the textarea growing feature and changing input.body (increasing the rows when line breaks occuring in all possible ways)

    const commentInputhandle = (e) => {
        setCommentInput(e.target.value);
        const textarea = commentInputRef.current; //Taking reference of comment Input to textarea variable
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
        if (nLines <= 6) {
            setRows(6);
        } else if (nLines > 6) {
            setRows(nLines)
        }

    }

    //Handle share comment 
    const handleShareQuestion = () => {
        showToastMessage('linkCopied')
        navigator.clipboard.writeText(window.location.origin + location.pathname + '#' + comment.id)
    }

    return (
        <>
            <ToastContainer />
            <div className='w-[100%]'>
                <div className='flex flex-row border-gray-500 border w-auto rounded-lg mb-4 mr-4' id={comment.id} ref={commentRef}>
                    <div className='p-2'>
                        <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className='flex flex-col w-full'>
                        <div className='my-5'>
                            <div className='flex items-center ml-1 text-base  font-medium'>{comment.author.userName}</div>
                        </div>
                        <div className=''>
                            <div className='mb-2 px-1.5 w-auto'>
                                {index + 1 + ': ' + comment.body}  {/* Comment with SI number(index+1). This commet can be root comment or nested comment*/}
                            </div>
                            <div className='mt-5 flex justify-start '>
                                {isReplaying ?
                                    <div className='mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5' onClick={() => setIsReplaying(false)}>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                            </svg>
                                        </div>
                                        <div className='ml-1 text-sm font-medium'>Close</div>
                                    </div>
                                    :
                                    <div className=' mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5' onClick={() => setIsReplaying(true)}>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                            </svg>
                                        </div>
                                        <div className='ml-1 text-sm font-medium'>Replay</div>
                                    </div>
                                }
                                <div className='hover:bg-gray-300 mr-2 flex justify-center items-center rounded-md p-1.5'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 48 48">
                                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8Z"></path>
                                    </svg>
                                    <button className='ml-1 text-sm font-medium '>Like</button>
                                </div>
                                <div className='hover:bg-gray-300 mr-2 flex justify-center items-center rounded-md p-1.5' onClick={handleShareQuestion}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 256 256">
                                        <path fill="currentColor" d="m237.66 106.35l-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91c-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z"></path>
                                    </svg>
                                    <button className='ml-1 text-sm font-medium '>Share</button>
                                </div>
                            </div>
                        </div>
                        <div className='my-5'>
                            {isReplaying &&
                                <div className='border-[2px] border-gray-200 rounded-md'>
                                    <textarea placeholder="what's your answer to this question" ref={commentInputRef} className='border-[1px] border-red-300 rounded-t-md w-full py-2 px-5 overflow-hidden  w-[100%] outline-none text-base' onInput={commentInputhandle} rows={rows} value={commentInput}></textarea>
                                    <div className='bg-gray-500 relative p-4 border-[3px] border-blue-800'> {/* used relateive and abosulute to place the replay button to end of this div */}
                                        <button className='absolute right-0 bottom-0 border-[2px] border-black bg-green-400 rounded-md p-[2px]'>Reply</button>
                                    </div>
                                </div>}
                        </div>

                        {/* Maping the Comment component inside the Comment component with the comments of comment*/}
                        <div className='w-full'>
                            {comment.comments && comment.comments.map((comment, index) => (
                                <Comment key={comment} comment={comment} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Comment