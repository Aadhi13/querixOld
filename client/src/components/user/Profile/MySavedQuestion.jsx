import React, { useEffect, useState } from 'react'
import axios from '../../../api/axios';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../../redux/features/user/userDataSlice';
import { DownVote, UpVote } from '../../../assets/icons/Icons';
import SavedQuestion from './SavedQuestion';

export default function MySavedQuestion() {

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
                const res = (await axios.get("/user-saved-questions-data", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    withCredentials: true,
                }));
                setData(res.data.savedQuestionsData)
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [update])

    useEffect(() => {
        console.log("We are at MY Saved Question component");
    }, [])

    return (
        <div className=''>
            <div className='text-2xl capitalize font-semibold pb-5'>Saved Questions</div>
            <div className='flex flex-col rounded-lg border h-fit p-3 gap-3'>                 {/* Saved Question  */}

                {data && data.map((savedQuestion) => (
                    <SavedQuestion savedQuestion={savedQuestion} key={savedQuestion._id} onUpdate={triggerFetchData} />
                ))}


            </div>
        </div>
    )
}