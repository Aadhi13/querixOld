import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { cardStyles } from "./ReusableStyles";
import { IoStatsChart } from "react-icons/io5";
import { BiGroup } from "react-icons/bi";
import { FiActivity } from "react-icons/fi";
import { message } from 'antd';
import axios from "../../../api/axios";
import { useDispatch } from "react-redux";
import { getAdminData } from "../../../redux/features/admin/adminDataSlice";

export default function Analytics() {

    const dispatch = useDispatch();
    const [usersCount, setUsersCount] = useState();
    const [questionsCount, setQuestionsCount] = useState();
    const [answersCount, setAnswerCount] = useState();
    const [commentsCount, setCommentsCount] = useState();
    const [loading, setLoading] = useState(false);


    //Below useEffect will fetch the count of major collections.
    useEffect(() => {
        console.log('running useEffect of analytics');
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('admin');
                console.log('ana token', token);
                if (!token) {
                    dispatch(getAdminData());
                } else {
                    const res = (await axios.get(
                        "/admin/documents-count", {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                        withCredentials: true,
                    }));
                    setUsersCount(res.data.usersCount);
                    setQuestionsCount(res.data.questionsCount);
                    setAnswerCount(res.data.answersCount);
                    setCommentsCount(res.data.commentsCount);
                    console.log(res.data);
                }
            } catch (err) {
                console.log('err', err)
                console.log(err.message);
                message.error('Something went wrong.')
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [])


    return (

        <Section className="mt-10">

            <div className="analytic ">
                <div className="logo">
                    <BiGroup />
                </div>
                <div className="content">
                    <h5>Users</h5>
                    <h2>{usersCount}</h2>
                </div>
            </div>

            <div className="analytic">
                <div className="logo">
                    <IoStatsChart />
                </div>
                <div className="content">
                    <h5>Questions</h5>
                    <h2>{questionsCount}</h2>
                </div>
            </div>

            <div className="analytic ">
                <div className="content">
                    <h5>Comments</h5>
                    <h2>{commentsCount}</h2>
                </div>
                <div className="logo">
                    <FiActivity />
                </div>
            </div>

            <div className="analytic">
                <div className="content">
                    <h5>Answers</h5>
                    <h2>{answersCount}</h2>
                </div>
                <div className="logo">
                    <IoStatsChart />
                </div>
            </div>
        </Section>
    );
}
const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  place-items: center;
  gap: 2rem;
  .analytic {
    ${cardStyles};
    padding: 1rem;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 1rem;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #ffc107;
      color: black;
      svg {
        color: white;
      }2
    }
    .logo {
      background-color: black;
      border-radius: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
      svg {
        font-size: 1.5rem;
      }
    }
  }

  @media screen and (min-width: 280px) and (max-width: 720px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    .analytic {
      &:nth-of-type(3),
      &:nth-of-type(4) {
        flex-direction: row-reverse;
      }
    }
  }
`;