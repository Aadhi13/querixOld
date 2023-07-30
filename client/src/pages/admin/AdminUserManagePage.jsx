import React from 'react'
import styled from 'styled-components';
import Sidebar from '../../components/admin/Dashboard/Sidebar';
import UserManage from '../../components/admin/Users/UserManage';
export default function AdminUserManagePage() {
    return (
        <Div style={{ backgroundColor: 'black', height: "100vh" }} >
            <Sidebar defaultCurrentLink={2}/>
            <UserManage />
        </Div>
    )
}

const Div = styled.div`
  position:relative;
  overflow-y:auto;
`