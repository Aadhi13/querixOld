import React, { useEffect, useMemo, useState } from "react";
import axios from '../../../api/axios';
import Navbar from "../Dashboard/Navbar";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { BiTrashAlt } from 'react-icons/bi'
import BasicTable from "../Table/BasicTable";
import { Public, PublicOff } from "../../../assets/icons/Icons";


function QuestionManage() {

  const [questions, setQuestions] = useState([]);

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });


  //get all questions and update the questions state
  useEffect(() => {
    try {
      const token = localStorage.getItem("admin");
      if (!token) {
        localStorage.removeItem('admin');
        navigate('/admin/signin');
      };
      axios.get("/admin/questions-data", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        withCredentials: true,
      }).then((res) => {
        setQuestions(res.data.questionsData);
      });
    } catch (err) {
      if (!err?.res) {
        message.error('Something went wrong.')
      } else if (err.message == "Network Error") {
        message.error('Network Error.')
      } else if (err.response.data.message == "Invalid jwt token." || err.response.data.message == "Jwt expired." || err.response.data.message == "No jwt token.") {
        localStorage.removeItem("admin");
        navigate('/admin/signin');
      } else {
        message.error('Something went wrong.')
      }
    }
  }, []);

  useEffect(() => {
    console.log('questions ', questions);
  }, [questions])

  const data = useMemo(() => questions, [questions]);


  //blocking & unblocking questions
  const handleQuestionAction = async (questionId, userName, action) => {
    console.log('questionId => ', questionId, '\nuserName => ', userName, '\naction => ', action);
    try {
      const token = localStorage.getItem("admin");
      if (!token) {
        localStorage.removeItem('admin');
        navigate('/admin/signin');
        return; // Exit the function early if the user is not authenticated
      }

      const wrapper = document.createElement('div');
      wrapper.innerHTML = `Are you sure you want to ${action} this question by <span style="font-weight: 500;">${userName}</span>?`;

      const userAction = await swal({
        title: "Are you sure?",
        content: wrapper,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (userAction) {
        const response = await axios.put(`/admin/${action}-question/` + questionId, {}, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          swal(`Question by ${userName} ${action}ed!`, {
            icon: "success",
          });

          const questionsResponse = await axios.get("/admin/questions-data", {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            withCredentials: true,
          });

          setQuestions(questionsResponse.data.questionsData);
        } else {
          swal(`Error occurred. Question by ${userName} didn't ${action}ed!`, {
            icon: "error",
          });
        }
      } else {

        const wrapper2 = document.createElement('div');
        wrapper2.innerHTML = `${action}ing questoin by <span style="font-weight: 500;">${userName}</span> has been cancelled.`;

        swal({
          title: `${action}ing Cancelled`,
          content: wrapper2,
          icon: "info",
          button: "OK",
        })
      }
    } catch (error) {
      console.log("Error in catch ", error);
      const wrapper3 = document.createElement('div');
      wrapper3.innerHTML = `An unknown error occurred. Question by <span style="font-weight: 500;">${userName}</span> didn't <span style="font-weight: 500;">${action}ed</span>!`;
      swal({
        title: "Error",
        content: wrapper3,
        icon: "error",
        button: "OK",
      });
    }
  };



  const columns = [
    {
      header: "Sl",
      accessorKey: "_id",
      cell: (props) => props.row.index + 1,
    },
    {
      header: "Question",
      accessorKey: "question",
      cell: (props) => (
        <>
          <div className="whitespace-nowrap overflow-ellipsis overflow-hidden mb-1">{props.getValue().title}</div>
          <div className="text-sm font-normal whitespace-nowrap overflow-ellipsis overflow-hidden">{props.getValue().body}</div>
        </>
      )
    },
    {
      header: "Author",
      accessorKey: "author",
      cell: (props) => props.getValue().userName,
    },
    {
      header: "Votes",
      accessorKey: "votes",
      cell: (props) => parseInt(props.getValue().upVotes) - parseInt(props.getValue().downVotes),
    },
    {
      header: "Up Votes",
      accessorKey: "votes",
      cell: (props) => parseInt(props.getValue().upVotes),
    },
    {
      header: "Down Votes",
      accessorKey: "votes",
      cell: (props) => parseInt(props.getValue().downVotes),
    },
    {
      header: "Answers",
      accessorKey: "answersCount",
    },
    {
      header: "Comments",
      accessorKey: "commentsCount",
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: info => formattedDate.format(new Date(info.getValue())),
    },
    {
      header: "Last Interacted",
      accessorKey: "updatedAt",
      cell: info => formattedDate.format(new Date(info.getValue())),
    },
    {
      header: "Actions",
      accessorKey: "blockStatus",
      accessorFn: row => `${row.blockStatus ? 'Unblock' : 'Block'}`,
      cell: (props) => (
        <button
          className={`${props.getValue() == 'Unblock' ? 'bg-green-800 hover:bg-green-900' : 'bg-red-800 hover:bg-red-900'} text-white  w-28 py-2 rounded-lg`}
          onClick={() => {
            console.log('clicked', props.row.original._id);
            handleQuestionAction(props.row.original._id, props.row.original.author.userName, props.getValue().toLowerCase())
          }}>
          <div className="flex items-center justify-evenly">{props.getValue()}<span>{props.getValue() == 'Block' ? <PublicOff /> : <Public />}</span></div>
        </button>
      ),
    },
  ];


  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "80px",
      duration: 2000,
      reset: false,
    });
    sr.reveal(
      `
        nav,
        .row__one,
        .row__two
    `,
      {
        opacity: 0,
        interval: 100,
      }
    );
  }, []);

  return (
    <div className="body">
      <Section style={{ backGroundColor: "black" }}>
        <Navbar />
        <div className="grid">
          <div className="row__one">
            <BasicTable data={data} columns={columns} title={'Questoins Details'} tableFor={'questionManage'} />
          </div>
        </div>
        {/* <Toaster /> */}
      </Section>
    </div>
  );
}

const Section = styled.section`
  margin-left: 18vw;
  padding: 2rem;
  height: 100%;
  .grid {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
    margin-top: 2rem;
    .row__one {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 1rem;
      margin-top: 2rem;
    }
    .row__two {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      height: 50%;
    }
  }
.secondDiv{
  height: 32vh;
  background-color: black;
}
  @media screen and (min-width: 280px) and (max-width: 1080px) {
    margin-left: 0;
    .grid {
      .row__one,
      .row__two {
        grid-template-columns: 1fr;
      }
    }
  }
`;

export default QuestionManage;
