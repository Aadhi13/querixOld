import React, { useEffect, useState, useMemo } from 'react'
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import { message } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getAdminData } from "../../../redux/features/admin/adminDataSlice"

import Navbar from "../Dashboard/Navbar";
import BasicTable from '../Table/BasicTable';
import axios from '../../../api/axios';
import swal from 'sweetalert';
import { Public, PublicOff } from '../../../assets/icons/Icons';


export default function UserManage() {
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();


    //geting users details and updating  users
    useEffect(() => {
        try {
            const token = localStorage.getItem("admin");
            if (!token) {
                localStorage.removeItem('admin');
                navigate('/admin/signin');
            };
            axios.get("/admin/users-data", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                withCredentials: true,
            }).then((res) => {
                setUsers(res.data.usersData);
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

    const data = useMemo(() => users, [users]);


    //blocking & unblocking users 
    const handleUserAction = async (userId, userName, action) => {
        try {
            const token = localStorage.getItem("admin");
            if (!token) {
                localStorage.removeItem('admin');
                navigate('/admin/signin');
                return; // Exit the function early if the user is not authenticated
            }

            const wrapper = document.createElement('div');
            wrapper.innerHTML = `Are you sure you want to ${action} <span style="font-weight: 500;">${userName}</span>?`;

            const userAction = await swal({
                title: "Are you sure?",
                content: wrapper,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            });

            if (userAction) {
                const response = await axios.put(`/admin/${action}-user/` + userId, {}, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    withCredentials: true,
                });

                if (response.data.success) {
                    swal(`User ${userName} ${action}ed!`, {
                        icon: "success",
                    });

                    const usersResponse = await axios.get("/admin/users-data", {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                        withCredentials: true,
                    });

                    setUsers(usersResponse.data.usersData);
                } else {
                    swal(`Error occurred. User ${userName} didn't ${action}ed!`, {
                        icon: "error",
                    });
                }
            } else {

                const wrapper2 = document.createElement('div');
                wrapper2.innerHTML = `${action}ing <span style="font-weight: 500;">${userName}</span> has been cancelled.`;

                swal({
                    title: `${action}ing Cancelled`,
                    content: wrapper2,
                    icon: "info",
                    button: "OK",
                })
            }
        } catch (error) {
            const wrapper3 = document.createElement('div');
            wrapper3.innerHTML = `An unknown error occurred. User <span style="font-weight: 500;">${userName}</span> didn't <span style="font-weight: 500;">${action}ed</span>!`;
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
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "User Name",
            accessorKey: "userName",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Verified",
            accessorKey: "verifyStatus",
            accessorFn: row => `${row.verifyStatus ? 'Yes' : 'No'}`,
        },
        {
            header: "Actions",
            accessorKey: "blockStatus",
            accessorFn: row => `${row.blockStatus ? 'Unblock' : 'Block'}`,
            cell: (props) => (
                <button
                    className={`${props.getValue() == 'Unblock' ? 'bg-green-800 hover:bg-green-900' : 'bg-red-800 hover:bg-red-900'} text-white  w-28 py-2 rounded-lg`}
                    onClick={() => {
                        handleUserAction(props.row.original._id, props.row.original.userName, props.getValue().toLowerCase())
                    }}>
                    <div className="flex items-center justify-evenly">{props.getValue()}<span>{props.getValue() == 'Block' ? <PublicOff /> : <Public />}</span></div>
                </button>
            ),
        },
    ];


    useEffect(() => {
        const sr = scrollreveal({
            origin: "bottom",
            distance: "150px",
            duration: 2000,
            reset: false,
        });
        sr.reveal(`
            nav,
            .row__one,
            .row__two
        `,
            {
                opacity: 0,
                interval: 500,
            }
        );
    }, []);

    return (
        <div className="body">
            <Section style={{ backGroundColor: "black" }}>
                <Navbar />
                <div className="grid">
                    <div className="row__one">
                        <BasicTable data={data} columns={columns} title={'Users Details'} tableFor={'userManage'} />
                    </div>
                </div>
            </Section>
            <div className="divComplete"></div>
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