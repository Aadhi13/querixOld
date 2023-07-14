import React from 'react'
import styled from 'styled-components';
import Dashboard from '../../components/admin/Dashboard/Dashboard'
import Sidebar from '../../components/admin/Dashboard/Sidebar';
import '../../assets/styles/admin/adminDashboardPage.css'
export default function AdminDashboardPage() {
    return (
        <Div style={{ backgroundColor: 'black', height: "100vh" }} >
            <Sidebar />
            <Dashboard />
        </Div>
    )
}

const Div = styled.div`
  position:relative
`