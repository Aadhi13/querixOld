import React from 'react'
import styled from 'styled-components';
import Sidebar from '../../components/admin/Dashboard/Sidebar';
import ReportedQuestionManage from '../../components/admin/ReportedQuestions/ReportedQuestionManage';
export default function AdminReportedQuestionManagePage() {
    return (
        <Div style={{ backgroundColor: 'black', height: "100dvh" }} >
            <Sidebar defaultCurrentLink={4} />
            <ReportedQuestionManage />
        </Div>
    )
}

const Div = styled.div`
  position:relative;
  overflow-y:auto;
`