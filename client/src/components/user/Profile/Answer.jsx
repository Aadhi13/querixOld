import React, { useEffect, useRef, useState } from 'react'
import { Cancel, Delete, Edit, Open, SaveSubmit, SpinningWheel } from '../../../assets/icons/Icons';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import Swal from 'sweetalert2';

const INPUT_REGEX = /[^\s\n]/;

export default function Answer(props) {

    const { answer, onUpdate } = props;
    const navigate = useNavigate()
    const textAreaRef = useRef(null);
    const answerDivRef = useRef(null);
    const [rows, setRows] = useState(2);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState('')
    const [validInputData, setValidInputData] = useState(true);

    useEffect(() => {
        console.log("We are at Answer component");
    }, [])

    useEffect(() => {
        setInputData(answer.answer);
    }, [answer]);

    useEffect(() => {
        const textarea = answerDivRef.current;
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
    }, [answerDivRef])

    //Navigate to questoin page and highlite answer when user clicks on answer 
    const handleViewButton = () => {
        const url = `/question/${answer.question}#${answer._id}`;
        const newState = { isAnswer: true };
        const newTab = window.open(url, '_blank');
        if (newTab) {
            newTab.state = newState;
        } else {
            navigate(url, { state: newState });
        }
    };

    const handleEditButton = () => {
        console.log('clicked. iseditiong: ', isEditing);
        setIsEditing(!isEditing)
    }

    const handleChangeDetails = (e) => {
        setInputData(e.target.value);
        const regex = new RegExp(eval(INPUT_REGEX));
        const result = regex.test(e.target.value);
        setValidInputData(result);
    };

    //To handle the textarea growing feature and changing input (increasing the rows when line breaks occuring in all possible ways)
    const texAreaHandleInput = async (e) => {
        await handleChangeDetails(e);
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

    const handleSubmitButton = async () => {
        console.log('clicked submit');
        setLoading(true);
        // Make a put request to submit edited values
        try {
            const token = localStorage.getItem('user');
            if (!token) {
                dispatch(getUserData());
            }
            setIsEditing(false)
            const res = await axios.put('edit-answer', { inputData, answerId: answer?._id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                withCredentials: true,
            });
            console.log(res.data);
        } catch (err) {
            console.log(err.message);
        }

        setTimeout(() => {
            onUpdate();
            setLoading(false);
        }, 1000)
    }

    const handleCancelButton = () => {
        setIsEditing(false)
    }

    //Handle delete butotn
    const handleDeleteButton = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '<span>Yes, delete it!</span>',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            reverseButtons: true, // Reverses the order of buttons
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('user');
                    if (!token) {
                        dispatch(getUserData());
                    }

                    axios.delete('delete-answer', {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                        withCredentials: true,
                        data: {
                            answerId: answer?._id
                        }
                    }).then(() => {
                        Swal.fire(
                            'Deleted!',
                            'Your item has been deleted.',
                            'success'
                        );
                        onUpdate();
                    });
                } catch (err) {
                    console.log(err.message);
                    onUpdate();
                    Swal.fire(
                        'Error!',
                        err.message,
                        'error'
                    );
                }
            }

        });
    };


    return (
        <div className={`flex flex-col hover:bg-gray-200 ${answer?.blockStatus ? 'bg-red-100' : 'bg-gray-100'} rounded-lg border p-2`}>
            <div className='flex flex-row'>
                <div className='px-2 flex justify-center items-center text-lg font-medium border-orange-800'>
                    {answer?.votes && answer?.votes.upVote.count - answer?.votes.downVote.count}
                </div>
                <div className='flex flex-col px-2 py-3 mr-10 border-blue-700 w-full'>
                    {!isEditing ?
                        <div className='whitespace-pre-wrap' ref={answerDivRef}>
                            {answer?.answer}
                        </div>
                        : <textarea name='answer' placeholder='Finesse Your Answer: Shape and Elevate Your Knowledge.' ref={textAreaRef} className={`overflow-hidden pr-1.5 mb-3 w-[98%] text-base p-1 rounded-md whitespace-pre-wrap outline-1 outline ${validInputData ? 'outline-green-700' : 'outline-[#ff0000]'}`} onInput={texAreaHandleInput} rows={rows} value={inputData}></textarea>
                    }
                </div>
            </div>
            <div className='flex flex-row justify-between font-semibold text-xl mb-2'>
                <div className='text-sm font-normal text-gray-400 ml-8'>
                    {new Date(answer?.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        timeZoneName: 'short',
                    })}
                </div>
                <div className='flex flex-row justify-between items-center gap-3 pr-3 border-red-800'>
                    <button className='hover:text-blue-800 text-center mt-1' onClick={handleViewButton}>
                        <Open />
                    </button >
                    {!loading ?
                        (!isEditing ?
                            (<>
                                <button className='hover:text-green-800 text-center flex justify-center items-center' onClick={handleEditButton}>
                                    <Edit />      {/* To display edit button */}
                                </button>
                                <button className='text-center mt-1' onClick={handleDeleteButton}>
                                    <Delete color='red' />
                                </button>
                            </>) :
                            (<>
                                <button disabled={!validInputData} onClick={handleSubmitButton} className='flex justify-center items-center disabled:text-gray-700 disabled:opacity-60 mt-1 hover:text-green-700' >
                                    <SaveSubmit /> {/* To display save button */}
                                </button>
                                <button onClick={handleCancelButton} className='flex justify-center items-center mt-1'>
                                    <Cancel color='red' /> {/* To display Cancel button */}
                                </button>
                            </>)) :
                        (<>
                            <button className='-mb-3'>
                                <SpinningWheel height={"1.5em"} />              {/* To display spinning button */}
                            </button>
                        </>)
                    }
                </div>
            </div>
        </div>
    )
}

