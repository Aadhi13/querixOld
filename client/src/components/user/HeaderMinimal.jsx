import React from 'react'
import { Link } from 'react-router-dom';

function HeaderMinimal() {
    return (
        <>
            <div>
                <header className='px-3 sm:pt-10 pt-5 flex justify-start'>
                    <Link to={'/'}>
                        <div className="flex items-center gap-1 2xl:ml-32 xl:ml-28 ml:ml-20 lg:ml-20 md:ml-14 sm:ml-10 xs:ml-8 ml-5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-black">
                                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                            </svg>
                            <span className='font-bold text-xl text-black'>Querix</span>
                        </div>
                    </Link>
                </header>
            </div>
        </>
    )
}

export default HeaderMinimal