import React, { useEffect } from 'react'
import { DownVote, UpVote } from '../../../assets/icons/Icons';

export default function SavedAnswer() {

    useEffect(() => {
        console.log("We are at Saved Answer component");
    }, [])

    return (
        <div className=''>
            <div className='text-2xl capitalize font-semibold pb-5'>Saved Answers</div>
            <div className='flex flex-col rounded-lg border h-fit p-3 gap-3'>                 {/* Saved Answers */}

                <div>
                    <div className='flex flex-row border-gray-400 border rounded-lg bg-gray-100 hover:bg-gray-200'>
                        <div className='p-2'>
                            <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className='p-1 mt-4'>
                                <div className={`flex justify-center items-center hover:bg-gray-300 rounded-md py-1 text-lg`}>
                                    <UpVote />
                                </div>
                                <div className='flex justify-center items-center text-lg'>
                                    2
                                </div>
                                <div className={`flex justify-center items-center hover:bg-gray-300 rounded-md py-1 text-lg`}>
                                    <DownVote />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col w-full mr-12 my-3'>
                            <div className='mt-[1px]'>
                                <div className='flex items-center ml-1 text-base font-medium'>Abdul Vahid</div>
                                <div className='flex items-center ml-1 text-sm'>@abdulvahid777</div>
                            </div>
                            <div className='mt-4'>
                                <div className='pr-1.5 mb-3'>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
                                    modi minima mollitia vitae fugiat adipisci explicabo perspiciatis deleniti itaque non, minus,
                                    vel vero ipsum doloribus alias aliquid iusto tempora doloremque.
                                </div>
                                <div className='flex justify-start'>
                                    <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5' >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                        </svg>
                                        <button className='ml-1 text-sm font-medium '>Save</button>
                                    </div>
                                    <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className='w-5 h-5'>
                                            <path fill="currentColor" d="m237.66 106.35l-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91c-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z"></path>
                                        </svg>
                                        <button className='ml-1 text-sm font-medium '>Share</button>
                                    </div>
                                    <div className='relative mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer'>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className='flex flex-row border-gray-400 border rounded-lg bg-gray-100 hover:bg-gray-200'>
                        <div className='p-2'>
                            <div className='flex justify-center items-center rounded-full bg-profileBtBg w-12 h-12 overflow-hidden'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-profileBt w-11 h-11 mt-4">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className='p-1 mt-4'>
                                <div className={`flex justify-center items-center hover:bg-gray-300 rounded-md py-1 text-lg`}>
                                    <UpVote />
                                </div>
                                <div className='flex justify-center items-center text-lg'>
                                    2
                                </div>
                                <div className={`flex justify-center items-center hover:bg-gray-300 rounded-md py-1 text-lg`}>
                                    <DownVote />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col w-full mr-12 my-3'>
                            <div className='mt-[1px]'>
                                <div className='flex items-center ml-1 text-base font-medium'>Abdul Vahid</div>
                                <div className='flex items-center ml-1 text-sm'>@abdulvahid777</div>
                            </div>
                            <div className='mt-4'>
                                <div className='pr-1.5 mb-3'>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
                                    modi minima mollitia vitae fugiat adipisci explicabo perspiciatis deleniti itaque non, minus,
                                    vel vero ipsum doloribus alias aliquid iusto tempora doloremque.
                                </div>
                                <div className='flex justify-start'>
                                    <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5' >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                        </svg>
                                        <button className='ml-1 text-sm font-medium '>Save</button>
                                    </div>
                                    <div className='mr-2 flex justify-center items-center hover:bg-gray-300 hover:rounded-md p-1.5'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className='w-5 h-5'>
                                            <path fill="currentColor" d="m237.66 106.35l-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91c-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z"></path>
                                        </svg>
                                        <button className='ml-1 text-sm font-medium '>Share</button>
                                    </div>
                                    <div className='relative mr-2 flex justify-center items-center hover:bg-gray-300 rounded-md p-1.5 cursor-pointer'>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}

