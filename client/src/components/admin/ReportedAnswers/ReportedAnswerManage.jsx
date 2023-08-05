import React, { useEffect, useMemo, useState } from "react";
import axios from '../../../api/axios';
import Navbar from "../Dashboard/Navbar";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { BiTrashAlt } from 'react-icons/bi'
import BasicTable from "../Table/BasicTable";
import { Block, Close, FactCheck, Open, Pending, Public, PublicOff } from "../../../assets/icons/Icons";
import { message } from "antd";


export default function ReportedAnswerManage() {

    const [reportedAnswers, setReportedAnswers] = useState([]);
    const [reportedAnswerReasons, setReportedAnswerReasons] = useState([]);
    const [modalData, setModalData] = useState();

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });


    //get all reported answers and update the reportedAnswers state
    useEffect(() => {
        try {
            const token = localStorage.getItem("admin");
            if (!token) {
                localStorage.removeItem('admin');
                navigate('/admin/signin');
            };
            axios.get("/admin/reported-answers-data", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                withCredentials: true,
            }).then((res) => {
                console.log('res', res.data);
                setReportedAnswers(res.data.reportedAnswersData);
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
        console.log('Reported answers ', reportedAnswers);
    }, [reportedAnswers])

    const data = useMemo(() => reportedAnswers, [reportedAnswers]);


    //blocking & unblocking reported answers 
    const handleAnswerAction = async (answerId, userName, action) => {
        console.log('questionId => ', answerId, '\nuserName => ', userName, '\naction => ', action);
        try {
            const token = localStorage.getItem("admin");
            if (!token) {
                localStorage.removeItem('admin');
                navigate('/admin/signin');
                return; // Exit the function early if the user is not authenticated
            }

            const wrapper = document.createElement('div');
            wrapper.innerHTML = `Are you sure you want to ${action} this answer by <span style="font-weight: 500;">${userName}</span>?`;

            const userAction = await swal({
                title: "Are you sure?",
                content: wrapper,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            });

            if (userAction) {
                const response = await axios.put(`/admin/${action}-answer/` + answerId, {}, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    withCredentials: true,
                });

                if (response.data.success) {
                    swal(`Answer by ${userName} ${action}ed!`, {
                        icon: "success",
                    });

                    const answersResponse = await axios.get("/admin/reported-answers-data", {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                        withCredentials: true,
                    });

                    setReportedAnswers(answersResponse.data.reportedAnswersData);
                } else {
                    swal(`Error occurred. Answer by ${userName} didn't ${action}ed!`, {
                        icon: "error",
                    });
                }
            } else {

                const wrapper2 = document.createElement('div');
                wrapper2.innerHTML = `${action}ing answer of <span style="font-weight: 500;">${userName}</span> has been cancelled.`;

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
            wrapper3.innerHTML = `An unknown error occurred. Answer by <span style="font-weight: 500;">${userName}</span> didn't <span style="font-weight: 500;">${action}ed</span>!`;
            swal({
                title: "Error",
                content: wrapper3,
                icon: "error",
                button: "OK",
            });
        }
    };

    //To open Modal for viewig reasons for reporting.
    const openDialog = () => {
        const dialogElement = document.getElementById(`dialog`);
        if (dialogElement) {
            dialogElement.showModal();
        }
    };

    //To close Modal for viewing reasons for reporting.
    const closeDialog = () => {
        const dialogElement = document.getElementById(`dialog`);
        if (dialogElement) {
            dialogElement.close();
        }
    };

    //Handle view button
    const handleViewReasons = (details) => {
        try {
            //Make a request to get the reasons take answer id from details.id
            setReportedAnswerReasons([]);
            const token = localStorage.getItem("admin");
            if (!token) {
                localStorage.removeItem('admin');
                navigate('/admin/signin');
            };
            axios.get("/admin/reported-answer-reasons", {
                params: { reportedAnswerId: details.id },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                withCredentials: true,
            }).then((res) => {
                setModalData(details);
                setReportedAnswerReasons(res.data.reportedAnswerReasonsData);
            });
        } catch (err) {
            if (!err?.res) {
                message.error('Something went wrong.')
            } else if (err.message == "Network Error") {
                message.error('Network Error.')
            } else if (err.response.data.message == "Invalid jwt token." || err.response.data.message == "Jwt expired." || err.response.data.message == "No jwt token.") {
                localStorage.removeItem("admin");
                navigate('/admin/signin');
            } else if (err.response, data.message == "Invalid reported answer.") {
                message.error("Can't get data. Invalid reported answer.");
            } else {
                message.error('Something went wrong.')
            }
        }
    };

    useEffect(() => {
        if (reportedAnswerReasons.length > 0) {
            console.log('modal is going to open ');
            openDialog();
        }
    }, [reportedAnswerReasons]);

    const columns = [
        {
            header: "Sl",
            accessorKey: "_id",
            cell: (props) => props.row.index + 1,
        },
        {
            header: "Answer",
            accessorKey: "answer",
            cell: (props) => (
                <>
                    <div className="font-normal whitespace-nowrap overflow-ellipsis overflow-hidden">{props.getValue().body}</div>
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
            accessorKey: "votesCount",
            cell: (props) => props.row.original.votesCount,
        },
        {
            header: "Reports",
            accessorKey: "reportsCount",
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
            header: "Reasons",
            accessorKey: "_id",
            cell: (props) => (
                <>
                    <button
                        className={`bg-black hover:bg-gray-900 text-white  w-24 py-2 rounded-lg`}
                        onClick={async () => {
                            console.log('clicked View button: ', props.row.original.author.userName, props.getValue());
                            const author = props.row.original.author.userName;
                            const id = props.getValue();
                            const details = { id, author };
                            console.log('details', details);
                            handleViewReasons(details)
                        }}>
                        <div className="flex items-center justify-center gap-3">View<span><Open /></span></div>
                    </button>
                    <dialog id={`dialog`} className='top-[35dvh] xl:left-[35dvw] lg:left-[25dvw] md:left-[23dvw] sm:left-[20dvw] xs:left-[20dvw] left-[5dvw] rounded-lg focus:outline-0 border border-gray-500/75 backdrop:backdrop-blur-[4px] backdrop:bg-gray-400 backdrop:bg-opacity-20'>
                        <div className='bg-gray-100 xs:w-[400px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[650px] rounded-lg'>
                            <header className='bg-slate-200/50 flex flex-row justify-between items-center border-[0.5px] border-b-gray-400 px-7 py-4'>
                                <div className='text-xl font-bold'>Resons for reporting <span className='text-blue-600'>@{modalData?.author}'s</span> answer</div>
                                <div className='px-1 py-1 hover:bg-red-300/60 flex justify-start w-fit rounded-lg -mr-2 cursor-pointer' onClick={closeDialog}>
                                    <div className='flex justify-center'><Close color="red" width="1.2em" height="1.2em" /></div>
                                </div>
                            </header>
                            <div>
                                <div className='flex flex-col gap-5 h-72 my-4'>
                                    {reportedAnswerReasons.map((reason) => (
                                        <div key={reason._id} className="bg-gray-300/50 rounded-lg shadow-md p-4 mx-4">
                                            <div className="text-lg font-semibold mb-2">Reason:</div>
                                            <p className="text-black mb-4 pl-2">{reason.reason}</p>

                                            <div className="text-lg font-semibold mb-2">Reported User:</div>
                                            <p className="text-black mb-2 pl-2">{reason.user.name}</p>
                                            <p className="text-black pl-2">{`@${reason.user.userName}`}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </dialog>
                </>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (props) => (
                <button
                    className={`${props.getValue() === 'pending' ? 'bg-[#ffae00] hover:bg-[#ff9e0c] text-black' : (props.getValue() === 'blocked' ? 'bg-red-800 hover:bg-red-900 text-white' : 'bg-green-800 hover:bg-green-900 text-white')} capitalize w-[124px] py-2 rounded-lg`}
                    onClick={() => {
                        console.log('clicked status: ', props.getValue());
                    }}>
                    <div className="flex items-center justify-center gap-3">{props.getValue()}<span>{props.getValue() == 'pending' ? <Pending /> : (props.getValue() == 'blocked' ? <Block /> : <FactCheck />)}</span></div>
                </button>
            ),
        },
        {
            header: "Actions",
            accessorKey: "blockStatus",
            accessorFn: row => `${row.blockStatus ? 'Unblock' : 'Block'}`,
            cell: (props) => (
                <button
                    className={`${props.getValue() == 'Unblock' ? 'bg-green-800 hover:bg-green-900' : 'bg-red-800 hover:bg-red-900'} text-white  w-28 py-2 rounded-lg`}
                    onClick={() => {
                        console.log('clicked actions: ', props.row.original.answer._id);
                        handleAnswerAction(props.row.original.answer._id, props.row.original.author.userName, props.getValue().toLowerCase())
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
                        <BasicTable data={data} columns={columns} title={'Reported Questions Details'} tableFor={'questionManage'} />
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