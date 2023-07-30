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
  let isNotificationDisplayed = false;



  //Below useEffect will fetch the count of major collections.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('admin');
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
          isNotificationDisplayed = false;
        }
      } catch (err) {
        if (!isNotificationDisplayed) {
          message.error('Something went wrong.')
          isNotificationDisplayed = true;
        }
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


  @media screen and (min-width: 200px) {
    /* Use a single column layout with equal width */
    grid-template-columns: repeat(1, 1fr);
    .analytic {
      width: 12rem;
      &:nth-of-type(2),
      &:nth-of-type(3) {
        flex-direction: row-reverse;
      }
    }
  }

  @media screen and (min-width: 300px) {
    /* Use a single column layout with equal width */
    grid-template-columns: repeat(1, 1fr);
    .analytic {
        width: 15rem;
    }
  }

  @media screen and (min-width: 380px) {
    /* Use a single column layout with equal width */
    grid-template-columns: repeat(1, 1fr);
    .analytic {
        width: 19rem;
    }
  }

  @media screen and (min-width: 440px) {
    /* Use a single column layout with equal width */
    grid-template-columns: repeat(1, 1fr);
    .analytic {
        width: 23rem;
    }
  }

  @media screen and (min-width: 480px) {
    /* Use a single column layout with equal width */
    grid-template-columns: repeat(1, 1fr);
    .analytic {
        width: 25rem;
    }
  }

  @media screen and (min-width: 640px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(2, 1fr);
    .analytic {
        width: 17rem;
    }
  }

  @media screen and (min-width: 768px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(2, 1fr);
    .analytic {
      width: 21rem;
      
    }
  }

  @media screen and (min-width: 890px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(2, 1fr);
    .analytic {
        width: 24rem;
    }
  }

  @media screen and (min-width: 1024px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(2, 1fr);
    .analytic {
        width: 28rem;
    }
  }

  @media screen and (min-width: 1080px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(2, 1fr);
    .analytic {
        width: 24rem;
    }
  }

  @media screen and (min-width: 1280px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(2, 1fr);
    .analytic {
        width: 30rem;
    }
  }

  @media screen and (min-width: 1536px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(4, 1fr);
    .analytic {
      width: 17rem;
      &:nth-of-type(2),
      &:nth-of-type(3) {
        flex-direction: row;
      }
    }
  }

  @media screen and (min-width: 1700px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(4, 1fr);
    .analytic {
        width: 19rem;
    }
  }

  @media screen and (min-width: 1900px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(4, 1fr);
    .analytic {
        width: 21rem;
    }
  }

  @media screen and (min-width: 2100px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(4, 1fr);
    .analytic {
        width: 23rem;
    }
  }

  @media screen and (min-width: 2300px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(4, 1fr);
    .analytic {
        width: 25rem;
    }
  }

  @media screen and (min-width: 2500px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(4, 1fr);
    .analytic {
        width: 27rem;
    }
  }

  @media screen and (min-width: 2700px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(4, 1fr);
    .analytic {
        width: 29rem;
    }
  }

  @media screen and (min-width: 2900px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(4, 1fr);
    .analytic {
        width: 31rem;
    }
  }

  @media screen and (min-width: 3100px) {
    /* Use a two-column layout with equal width */
    grid-template-columns: repeat(4, 1fr);
    .analytic {
        width: 33rem;
    }
  }


`;