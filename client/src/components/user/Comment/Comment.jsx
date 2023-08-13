import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom'
import { Close, Flag, Save, Share } from '../../../assets/icons/Icons';
import axios from '../../../api/axios';

const INPUT_REGEX = /[^\s\n]/;

const Comment = forwardRef(function Comment(props, ref) {

    const location = useLocation()
    const { comment, index } = props;
    const commentRef = useRef()


    const textAreaRef = useRef(null);
    const [rows, setRows] = useState(4);
    const [input, setInput] = useState('')
    const [validInput, setValidInput] = useState(false);

    // Ref for the triggering div
    const triggerRef = useRef();

    // State to control whether the modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);




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
        } else if (type == 'successReportComment') {
            toast.success('Comment successfully reported.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'warningReportComment') {
            toast.warning('Comment is already reported by this user.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } else if (type == 'invalidReportComment') {
            toast.error(`Something went wrong. Can't find Comment.`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000
            });
        } else if (type == 'noUserReportComment') {
            toast.error('Please login to report a comment.', {
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


    //Modal 
    const openDialog = () => {
        setIsModalOpen(true);
        const dialogElement = document.getElementById(`dialog_${comment._id}`);
        if (dialogElement) {
            dialogElement.showModal();
        }
    };

    const openDialog2 = () => {
        closeDialog();
        const dialogElement = document.getElementById(`dialog2_${comment._id}`);
        if (dialogElement) {
            dialogElement.showModal();
        }
    };

    const closeDialog = () => {
        setIsModalOpen(false);
        const dialogElement = document.getElementById(`dialog_${comment._id}`);
        if (dialogElement) {
            dialogElement.close();
        }
    };

    const closeDialog2 = () => {
        const dialogElement = document.getElementById(`dialog2_${comment._id}`);
        if (dialogElement) {
            dialogElement.close();
            setInput('');
            setRows(4);
        }
    };

    const handleReportSubmit = async () => {
        console.log('Report =>', comment);
        try {
            setLoading(true);
            const token = localStorage.getItem('user');
            if (!token) {
                setInput('');
                setRows(4);
                showToastMessage('noUserReportComment');
                setLoading(false);
                return closeDialog2();
            }

            const response = await axios.post(
                '/report-comment',
                { reason: input, commentId: comment._id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                if (response.data.message === 'Comment successfully reported.') {
                    setInput('');
                    setRows(4);
                    showToastMessage('successReportComment');
                    setLoading(false);
                    return closeDialog2();
                } else if (response.data.message === 'Comment is already reported by this user.') {
                    setInput('');
                    setRows(4);
                    showToastMessage('warningReportComment');
                    setLoading(false);
                    return closeDialog2();
                }
            } else if (response.status === 409) {
                setInput('');
                setRows(4);
                showToastMessage('warningReportComment');
                setLoading(false);
                return closeDialog2();
            }

            setLoading(false);
        } catch (err) {
            console.log('err=>', err, '\n', 'err.reseponse=>', err.response);
            if (err === 'no token') {
                console.log(err, 'err');
                setInput('');
                setRows(4);
                showToastMessage('noUserReportComment');
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
                showToastMessage('noUserReportComment');
                setLoading(false);
            } else if (err.response.data.message == 'Comment is already reported by this user.') {
                setInput('');
                setRows(4);
                showToastMessage('warningReportComment');
                setLoading(false);
                return closeDialog2();
            } else if (err.response.data.message == 'Invalid comment.') {
                setInput('');
                setRows(4);
                showToastMessage('invalidReportComment');
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
            <div ref={ref} key={comment._id} className='w-[100%]'>
                <div className='flex flex-row border-gray-400 bg-yellow-50 border w-auto rounded-lg mb-4' id={comment.id} ref={commentRef}>
                    <div className='p-2'>
                        <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className='flex flex-col w-full mr-12 my-3'>
                        <div className='flex flex-row justify-between mt-[1px]'>
                            <div>
                                <div className='flex items-center ml-1 text-base font-medium'>{comment?.author?.name}</div>
                                <div className='flex items-center ml-1 text-sm'>@{comment?.author?.userName}</div>
                            </div>
                            <div>
                                <div className='flex justify-start '>
                                    <div ref={triggerRef} className='relative mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer' onClick={openDialog}>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <dialog id={`dialog_${comment?._id}`} style={modalStyles} className='rounded-lg focus:outline-0 border border-gray-500/75 backdrop:backdrop-blur-[1px] backdrop:bg-gray-100 backdrop:bg-opacity-5'>
                                        <div className='bg-gray-200 py-1.5 w-32 cursor-pointer'>
                                            <div className='px-2 py-1.5 hover:bg-gray-400/40 flex items-center justify-start' onClick={openDialog2}>
                                                <div className='px-1 mr-2 flex items-center justify-center'><Flag width="1.3em" height="1.3em" /></div> <div className='font-[450]'>Report</div>
                                            </div>
                                            <div className='px-2 py-1 hover:bg-red-300/60 flex items-center justify-start' onClick={closeDialog}>
                                                <div className='px-1 mr-2 flex items-center justify-center'><Close width="1.3em" height="1.3em" color="red" /></div> <div className='font-[450] text-red-600'>Cancel</div>
                                            </div>
                                        </div>
                                    </dialog>
                                    <dialog id={`dialog2_${comment._id}`} style={modalStyles} className='top-[-200px] left-[-65 0px] rounded-lg focus:outline-0 border border-gray-500/75 backdrop:backdrop-blur-[4px] backdrop:bg-gray-400 backdrop:bg-opacity-20'>
                                        <div className='bg-gray-100 w-[600px]  rounded-lg'>
                                            <header className='bg-slate-200/50 flex flex-row justify-between items-center border-[0.5px] border-b-gray-400 px-4 py-2'>
                                                <div className='text-lg font-bold'>Report <span className='text-blue-600'>@{comment?.author?.userName}'s</span> comment</div>
                                                <div className='px-1 py-1 hover:bg-red-300/60 flex justify-start w-fit rounded-lg -mr-2 cursor-pointer' onClick={closeDialog2}>
                                                    <div className='flex justify-center'><Close color="red" width="1.2em" height="1.2em" /></div>
                                                </div>
                                            </header>
                                            <div>
                                                <div className='flex flex-row border-gray-400 borderrounded-lg'>
                                                    <textarea placeholder={`Type your reason for reporting @${comment?.author?.userName}'s comment.`}
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
                        <div className='mt-4'>
                            <div className='mb-1 ml-1'>
                                <pre className='whitespace-pre-wrap font-sans'>
                                    {comment.comment}  {/* Comment body*/}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})

export default Comment