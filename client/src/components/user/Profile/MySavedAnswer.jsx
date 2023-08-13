import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../../redux/features/user/userDataSlice';
import { DownVote, UpVote } from '../../../assets/icons/Icons';
import SavedAnswer from './SavedAnswer';

export default function MySavedAnswer() {

    const dispatch = useDispatch()
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState(true)

    const triggerFetchData = () => {
        setUpdate(!update);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('user');
                if (!token) {
                    return dispatch(getUserData());
                }
                const res = (await axios.get("/user-saved-answers-data", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    withCredentials: true,
                }));
                setData(res.data.savedAnswersData)
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [update])

    
    return (
        <div className=''>
            <div className='text-2xl capitalize font-semibold pb-5'>Saved Answers</div>
            <div className='flex flex-col rounded-lg border h-fit p-3 gap-3'>                 {/* Saved Answers */}

                {data.length > 0 ? (
                    data && data.map((savedAnswer) => (
                        <SavedAnswer savedAnswer={savedAnswer} key={savedAnswer._id} onUpdate={triggerFetchData} />
                    ))
                ) : (
                    <div className='p-3 text-lg font-medium text-center'>No Answers to display, save some answers.</div>
                )}

            </div>
        </div>
    )
}

