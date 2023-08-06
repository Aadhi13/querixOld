import React from 'react'
import styled from 'styled-components';
import Sidebar from '../../components/admin/Dashboard/Sidebar';
import ReportedCommentManage from '../../components/admin/ReportedComments/ReportedCommentManage';

export default function AdminReportedCommentManagePage() {
    return (
        <Div style={{ backgroundColor: 'black', height: "100dvh" }} >
            <Sidebar defaultCurrentLink={6} />
            <ReportedCommentManage />
        </Div>
    )
}

const Div = styled.div`
  position:relative;
  overflow-y:auto;
`