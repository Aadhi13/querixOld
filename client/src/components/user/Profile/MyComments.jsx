import React, { useEffect, useState } from 'react'
import { Delete, Edit, Open } from '../../../assets/icons/Icons';
import axios from '../../../api/axios';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../../redux/features/user/userDataSlice';
import Comment from './Comment';

export default function MyComments() {

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
                const res = (await axios.get("/user-comments-data", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    withCredentials: true,
                }));
                setData(res.data.commentsData)
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [update])

    useEffect(() => {
        console.log("We are at MyComment component");
    }, [])

    return (
        <div className=''>
            <div className='text-2xl capitalize font-semibold pb-5'>My Comments</div>
            <div className='flex flex-col rounded-lg border h-fit p-3 gap-3'>                 {/* Comment */}

                {data.length > 0 ? (
                    data && data.map((comment) => (
                        <Comment comment={comment} key={comment?._id} onUpdate={triggerFetchData} />
                    ))
                ) : (
                    <div className='p-3 text-lg font-medium text-center'>No comments to display, comment some questions.</div>
                )}

            </div>
        </div>
    )
}
