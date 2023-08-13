import React, { useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { PlaceholderUser } from '../../../assets/icons/Icons'
import axios from '../../../api/axios';
const INPUT_REGEX = /[^\s\n]/;

export default function QuestionInput(props) {

    const { onUpdate } = props;
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
    const textAreaRef = useRef(null);

    //To handle question title input
    const titleHandleInput = (e) => {
        e.preventDefault();
        setInput({ ...input, title: e.target.value });
        const result = INPUT_REGEX.test(e.target.value);
        setValidInput({ ...validInput, title: result });
    };


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
        e.preventDefault();
        if (!input.title || !input.body || !validInput.title || !validInput.body) {
            return;
        }
        try {
            setLoader(true);
            const token = localStorage.getItem('user')
            if (!token) {
                setInput({ title: '', body: '', });
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
                onUpdate()
            }
            setLoader(false);
        } catch (err) {
            console.log(err);
            if (err == 'no token') {
                setInput({
                    title: '',
                    body: '',
                });
                setTags([]);
                showToastMessage('noUser')
                setLoader(false);
                //Can't submit question. Please login again.
            } else if (err.response.data.message == 'No user found.' || err.response.data.message === 'no token') {
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
            }
            setLoader(false);
        } finally {
            setRows(1);
        }

    }




    return (
        <>
            <ToastContainer />
            <div className='flex flex-row border-gray-400 border mx-56 rounded-lg mb-4'>
                <PlaceholderUser />
                <div className='flex flex-col pb-3 w-full'>
                    <div className='mt-2'>
                        <div className='flex justify-center items-center font-semibold text-xl my-3'>
                            <input onInput={titleHandleInput} value={input.title} placeholder='Title for your question?' type="text" className='w-[98%] text-2xl font-semibold outline-none' />
                        </div>
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
                    <div className='flex justify-end items-center mt-3'>
                        <div className='flex justify-center items-center mr-6 py-1 px-4 font-medium text-lg'>
                            <button onClick={questionSubmit} disabled={!input.title || !input.body || !validInput.title || !validInput.body} className='disabled:opacity-50 disabled:hover:bg-gray-400 bg-gray-400 hover:bg-profileBt rounded-2xl mr-6 py-1 px-4 font-medium text-lg'>
                                {!loader ? 'Submit' : 'Submiting...'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
