import React from 'react'
import Profile from '../../components/user/Profile/Profile'
import Dashboard from '../../components/user/Profile/Dashboard'
import Activity from '../../components/user/Profile/Activity'
import MyQuestion from '../../components/user/Profile/MyQuestion'
import MyAnswer from '../../components/user/Profile/MyAnswer'
import MyComments from '../../components/user/Profile/MyComments'
import MySavedQuestion from '../../components/user/Profile/MySavedQuestion'
import MySavedAnswer from '../../components/user/Profile/MySavedAnswer'

export default function AccountPage() {
    return (
        <>
            <div className='text-black flex flex-col items-center'>
                <div className='flex flex-col gap-y-12 px-10 py-5 w-[60dvw]'>
                    <Profile />
                    <Dashboard />
                    <Activity />
                    <MySavedQuestion />
                    <MySavedAnswer />
                    <MyQuestion />
                    <MyAnswer />
                    <MyComments />
                </div>
            </div>
        </>
    )
}