import React, { useEffect, useRef, useState } from 'react'
import { Cancel, Delete, Edit, Open, SaveSubmit, SpinningWheel } from '../../../assets/icons/Icons';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import Swal from 'sweetalert2';

const INPUT_REGEX = /[^\s\n]/;

export default function Question(props) {

    const { question, onUpdate } = props;
    const navigate = useNavigate()
    const textAreaRef = useRef(null);
    const bodyDivaRef = useRef(null);
    const [rows, setRows] = useState(3);
    const [tag, setTag] = useState('');
    const [tags, setTags] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({
        title: '',
        body: '',
        tags: [],
    })
    const [validInputData, setValidInputData] = useState({
        title: true,
        body: true,
    });
    
    useEffect(() => {
        setInputData(prevInputData => ({
            ...prevInputData,
            title: question?.question?.title,
            body: question?.question?.body,
            tags: question?.tags
        }));
        setTags(question?.tags);
    }, [question]);


    useEffect(() => {
        setInputData(prevInputData => ({
            ...prevInputData,
            tags: tags
        }));
    }, [tags]);


    useEffect(() => {
        const textarea = bodyDivaRef.current;
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
        if (nLines < 3) {
            setRows(3);
        } else {
            setRows(nLines);
        }
    }, [bodyDivaRef])

    //Navigate to single question page when user clicks on questions
    const handleViewButton = () => {
        const url = `/question/${question._id}`;
        const newState = { isAnswer: true };
        const newTab = window.open(url, '_blank');
        if (newTab) {
            newTab.state = newState;
        } else {
            navigate(url, { state: newState });
        }
    };

    const handleEditButton = () => {
        setIsEditing(!isEditing)
    }

    const handleChangeDetails = ({ currentTarget: input }) => {
        setInputData({ ...inputData, [input.name]: input.value });
        const regex = new RegExp(eval(INPUT_REGEX));
        const result = regex.test(input.value);
        setValidInputData({ ...validInputData, [input.name]: result });
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
        if (nLines < 3) {
            setRows(3);
        } else {
            setRows(nLines);
        }
    }

    const handleSubmitButton = async () => {
        setLoading(true);
        // Make a put request to submit edited values
        try {
            const token = localStorage.getItem('user');
            if (!token) {
                dispatch(getUserData());
            }
            setIsEditing(false)
            const res = await axios.put('edit-question', { inputData, questionId: question?._id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                withCredentials: true,
            });
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
                    const res = axios.delete('delete-question', {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                        withCredentials: true,
                        data: {
                            questionId: question?._id
                        }
                    });
                    Swal.fire(
                        'Deleted!',
                        'Your item has been deleted.',
                        'success'
                    );
                    onUpdate();
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
        <div key={question?._id} className={`flex flex-col hover:bg-gray-200 ${question.blockStatus ? 'bg-red-100' : 'bg-gray-100'} rounded-lg border p-2`}>
            <div className='flex flex-row'>
                <div className={`px-2 flex justify-center items-center text-lg font-medium border-orange-800
                                    ${question?.votes && question?.votes.upVote.count - question?.votes.downVote.count > 0
                        ? 'text-green-600'
                        : question?.votes && question?.votes.upVote.count - question?.votes.downVote.count < 0
                            ? 'text-red-600'
                            : 'black'}`}
                >
                    {question?.votes && question?.votes.upVote.count - question?.votes.downVote.count}
                </div>
                <div className='flex flex-col px-2 py-3 w-full'>
                    <div className='flex flex-row justify-between mb-2'>
                        <div className='w-[72%] whitespace-pre-wrap'>
                            {isEditing ?
                                <input name='title' onChange={handleChangeDetails} value={inputData?.title} placeholder='Title for your question?' type="text" className={`text-xl font-semibold w-full p-1 rounded-md outline-1 outline ${validInputData.title ? 'outline-green-700' : 'outline-[#ff0000]'}`} />
                                : <div className='font-semibold text-xl'>
                                    {question?.question.title}
                                </div>}
                        </div>
                        <div className='text-gray-400 mr-1'>
                            {new Date(question?.createdAt).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                timeZoneName: 'short',
                            })}
                        </div>
                    </div>
                    <div>
                        {!isEditing ?
                            <div className='whitespace-pre-wrap' ref={bodyDivaRef}>
                                {question?.question.body}
                            </div>
                            : <textarea name='body' placeholder='Finesse Your Question: Shape and Elevate Your Voice.' ref={textAreaRef} className={`overflow-hidden pr-1.5 mb-3 w-[98%] text-base p-1 rounded-md whitespace-pre-wrap outline-1 outline ${validInputData.body ? 'outline-green-700' : 'outline-[#ff0000]'}`} onInput={texAreaHandleInput} rows={rows} value={inputData.body}></textarea>
                        }
                    </div>
                    <div className='flex justify-start items-center '>
                        {!isEditing ?
                            <>{question.tags && question.tags.map((tag, index) => (
                                <div key={index} className='mr-2 bg-sky-100 py-0.5 px-1.5 rounded-md text-sm text-sky-700 mt-2' >{tag}</div>
                            ))}</>
                            : <>
                                {tags.map((tag, index) => (
                                    <div key={index} className='rounded-md inline-flex justify-between items-center relative cursor-default bg-sky-100 mx-1 h-6 text-sky-700'>
                                        <span className='block overflow-hidden whitespace-nowrap text-ellipsis text-sm py-0.5 px-1.5'>{tag}</span>
                                        <button className='flex justify-center items-center cursor-pointer text-center text-xl px-1 relative rounded-e-md rounded-s-sm h-[100%] bg-sky-300 hover:bg-sky-400' onClick={() => removeTag(index)}>&times;</button>
                                    </div>
                                ))}
                                {tags.length != 5 ?
                                    tags.length ?
                                        <input className='w-full mr-5 p-0.5 rounded-md outline-1 outline outline-blue-400  overflow-hidden ' type="text"
                                            value={tag} onChange={tagHandleChange} onKeyDown={tagHandleKyeDown} /> :
                                        <input className='w-full mr-5 p-0.5 outline-1 outline outline-blue-400 rounded-md overflow-hidden' type="text"
                                            placeholder='Add up to 5 tags' value={tag} onChange={tagHandleChange} onKeyDown={tagHandleKyeDown} />
                                    : null
                                }
                            </>
                        }
                    </div>
                </div>
            </div>

            {/* buttons for actions */}
            <div className='flex flex-row justify-end font-semibold text-xl mb-2'>
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
                                <button disabled={!validInputData.title || !validInputData.body} onClick={handleSubmitButton} className='flex justify-center items-center disabled:text-gray-700 disabled:opacity-60 mt-1 hover:text-green-700' >
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
        </div >
    )
}
