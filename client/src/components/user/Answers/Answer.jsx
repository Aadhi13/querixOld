import React, { useState } from 'react'
import Comment from './Comment'
import { DownVote, UpVote } from '../../../assets/icons/Icons'

function Answer({ answer, index }) {
    const [isReplaying, setIsReplaying] = useState(false)
    return (
        <>
            <div className='flex flex-row border-gray-300 border rounded-lg mb-4 bg-sky-100'>
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
                            10
                        </div>
                        <div className='flex justify-center items-center hover:text-red-600 text-lg'>
                            <DownVote />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-full mr-12'>
                    <div className='mt-2.5'>
                        <div className='flex items-center ml-1 text-base  font-medium'>{answer.author.userName}</div>
                    </div>
                    <div className='mt-3'>
                        <div className='pr-1.5 mb-3'>
                            {index + 1 + ': ' + answer.body}  {/* Root answer with SI number(index+1) */}
                        </div>
                        <div>
                            {isReplaying ?
                                <button
                                    className='text-red-700 bg-gray-400 text-sm font-semibold p-1 rounded-md hover:bg-black'
                                    onClick={() => setIsReplaying(false)}>
                                    Close
                                </button> :
                                <button
                                    className='text-black bg-green-300 text-sm font-semiboldbold p-1 rounded-md hover:bg-green-500'
                                    onClick={() => setIsReplaying(true)}>
                                    Comment
                                </button>
                            }
                        </div>
                    </div>
                    <div className='w-[745px] my-5 '>
                        {isReplaying && <input       // change the Input to the textarea 
                            type='text'
                            placeholder="what's your answer to this question"
                            className='border-black border-2 w-full h-full p-1 bg-slate-200'
                        />}
                    </div>
                    <div className='w-full'>
                        {answer && answer.comments.map((comment, index) => (
                            <Comment key={comment.id} comment={comment} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Answer