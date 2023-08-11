import React, { useEffect, useState } from 'react'
import { Text, Vote, Comment, Article } from '../../../assets/icons/Icons';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../../redux/features/user/userDataSlice';
import axios from '../../../api/axios';


export default function Dashboard() {
    const [data, setData] = useState([]);

    const dispatch = useDispatch()

    useEffect(() => {
        console.log("We are at Dashboard component");
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('user');
                if (!token) {
                    dispatch(getUserData());
                } else {
                    const res = (await axios.get('/dashboard-data', {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                        withCredentials: true,
                    }));
                    setData(res.data)
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [])

    const customShadow = {
        // right left down up
        textShadow:
            "0.3px 0.3px 0 black, 0.6px 0.6px 0 black, 0.9px 0.9px 0 black, 1.2px 1.2px 0 black",
    };

    return (
        <div className=''>
            <div className='text-2xl capitalize font-semibold pb-5'>Dashboard</div>
            <div className='flex flex-row justify-between rounded-2xl'>                 {/* Dashboard */}
                <div className='px-7 py-5 gap-7 flex items-center rounded-2xl bg-[#8b8b8b] hover:bg-gray-500 ease-in-out duration-300 justify-between w-56'>
                    <div className='p-5 text-lg rounded-full bg-black text-white'>
                        <Text />
                    </div>
                    <div style={customShadow} className='text-white font-semibold capitalize'>
                        <div>
                            Questions
                        </div>
                        <div className='text-xl'>
                            {data?.questionsCount}
                        </div>
                    </div>
                </div>
                <div className='px-7 py-5 gap-7 flex items-center rounded-2xl bg-[#8b8b8b] hover:bg-gray-500 ease-in-out duration-300 justify-between w-56'>
                    <div className='p-5 text-lg rounded-full bg-black text-white'>
                        <Article />
                    </div>
                    <div style={customShadow} className='text-white font-semibold capitalize'>
                        <div>
                            Answers
                        </div>
                        <div className='text-xl'>
                            {data?.answersCount}
                        </div>
                    </div>
                </div>
                <div className='px-7 py-5 gap-7 flex items-center rounded-2xl bg-[#8b8b8b] hover:bg-gray-500 ease-in-out duration-300 justify-between w-56'>
                    <div className='p-5 text-lg rounded-full bg-black text-white'>
                        <Comment />
                    </div>
                    <div style={customShadow} className='text-white font-semibold capitalize'>
                        <div>
                            Comments
                        </div>
                        <div className='text-xl'>
                            {data?.commentCount}
                        </div>
                    </div>
                </div>
                <div className='px-7 py-5 gap-7 flex items-center rounded-2xl bg-[#8b8b8b] hover:bg-gray-500 ease-in-out duration-300 justify-between w-56'>
                    <div className='p-5 text-lg rounded-full bg-black text-white'>
                        <Vote />
                    </div>
                    <div style={customShadow} className='text-white font-semibold capitalize'>
                        <div>
                            Total Votes
                        </div>
                        <div className='text-xl'>
                            {data?.totalVotes}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
