import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserData, logout } from '../../redux/features/userDataSlice';
import { menuHide, menuShowHide } from '../../redux/features/menuSlice';

function Header() {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.userData.userData)
  const menu = useSelector((state) => state.menu.headerMenuShow);

  useEffect(() => {
    dispatch(getUserData());
  }, [])

  const [searchBoxFocus, setSearchBoxFocus] = useState(false);

  return (
    <>
      <div onClick={() => dispatch(menuHide())}>
        <header className='p-3 flex justify-between mx-48'>
          <Link to={'/'}>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-black">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              <span className='font-bold text-xl text-black'>Querix</span>
            </div>
          </Link>
          <div className={`flex border items-center rounded-full ${searchBoxFocus && 'border-gray-500 border'} duration-1000 py-2 px-4 shadow-md shadow-gray-300`}>
            <button className='bg-black text-white rounded-full p-2'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <div className='flex items-center px-2'><input onFocus={() => setSearchBoxFocus(true)} onBlur={() => setSearchBoxFocus(false)} className='outline-none  pl-1 w-80' id='searchBox' placeholder='Search' type="text" /></div>
          </div>
          <div className='flex border items-center gap-2 border-gray-300 rounded-full py-2 px-4' onClick={(e) => { e.stopPropagation(); dispatch(menuShowHide()) }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
            <div className='bg-gray-500 rounded-full p-1 text-white'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </header>
        <div className='border-b-2 mb-5'></div>
        <div className='relative mr-44'>
          <div className={`absolute z-10 -top-7 right-6 ${!menu ? 'hidden' : 'block'} text-base w-60 border-2 border-gray-100  rounded-lg  bg-gray-50 shadow-lg shadow-slate-300`}>
            {userData ?
              <>
                <div className='h-6 p-3 py-5 mt-1 flex items-center hover:bg-gray-200 font-roboto font-semibold'>{userData.name}</div>
                <div className='h-6 p-3 py-5 flex items-center hover:bg-gray-200 font-roboto ' onClick={() => { dispatch(logout()) }}>Logout</div>
              </>
              :
              <>
                <Link to='/signin' className='h-6 p-3 py-5 flex items-center hover:bg-gray-200 font-roboto font-semibold'>Login</Link>
                <Link to='/signup' className='h-6 p-3 py-5 flex items-center hover:bg-gray-200 font-roboto '>Register</Link>

              </>
            }
            <div className='border-t border-gray-300 my-2'></div>
            <div className='h-6 p-3 py-5 flex items-center hover:bg-gray-200 font-roboto '>Help</div>
            <div className='h-6 p-3 py-5 flex items-center hover:bg-gray-200 font-roboto '>Settings</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header