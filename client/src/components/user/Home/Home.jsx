import React, { useCallback, useEffect, useRef, useState } from 'react'
import QuestionInput from './QuestionInput'
import QuestionHome from './QuestionHome';
import { SpinningWheel } from '../../../assets/icons/Icons';
import { getUserData } from '../../../redux/features/user/userDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../api/axios';

export default function Home() {

    const dispatch = useDispatch();
    const userDataFromStore = useSelector((state) => state.userData.userData);
    const [update, setUpdate] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(0)
    const observer = useRef()
    const [userData, setUserData] = useState({
        _id: '',
        name: '',
        userName: '',
        email: '',
        savedQuestions: [],
        savedAnswers: [],
    });

    useEffect(() => {
        dispatch(getUserData());
    }, []);

    useEffect(() => {
        if (userDataFromStore) {
            setUserData(userDataFromStore);
        }
    }, [userDataFromStore])

    const lastQuestionRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const fetchData = async () => {
        setLoading(true);
        const response = await axios.get("/questions-data", { params: { page: pageNumber } });
        const updatedQuestions = [...questions, ...response.data.questions];
        setQuestions(updatedQuestions);
        setHasMore(response.data.questionsCount > updatedQuestions.length);     //document count > questions count
        setLoading(false);
    };

    const reFetchData = async () => {
        setLoading(true);
        const response = await axios.get("/questions-data", { params: { page: pageNumber } });
        const updatedQuestions = [...response.data.questions];
        setQuestions(updatedQuestions);
        setHasMore(response.data.questionsCount > updatedQuestions.length);     //document count > questions count
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [pageNumber])

    const triggerFetchData = () => {
        // Reset pagination-related state
        setPageNumber(0);
        setQuestions([]);
        setHasMore(false);

        // Fetch data again
        reFetchData();
    };

    //Debug responsive 
    // border-red-500 xs:border-blue-500 sm:border-green-500 md:border-orange-500 
    // lg:border-violet-500 ml:border-yellow-500 xl:border-pink-500 2xl:border-cyan-500 3xl:border-rose-500

    return (
        <div className='border mx-2 xs:mx-4 sm:mx-8 md:mx-16 lg:mx-28 ml:mx-44 xl:mx-52 2xl:mx-[24rem] 3xl:mx-[28rem]'>

            <QuestionInput onUpdate={triggerFetchData} />

            {questions.map((question, index) => (
                <QuestionHome
                    ref={questions.length === index + 1 ? lastQuestionRef : null}
                    index={index}
                    question={question}
                    key={question._id}
                    userData={userData}
                    onUpdate={triggerFetchData}
                />
            ))}


            {loading ?
                <div className='flex justify-center items-center mx-56 rounded-lg my-20`'>
                    <SpinningWheel height={"1.5em"} width={"1.5em"} />
                </div> : null
            }
        </div>
    )
}
