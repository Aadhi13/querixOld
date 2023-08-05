import React from 'react'
import styled from 'styled-components';
import Sidebar from '../../components/admin/Dashboard/Sidebar';
import ReportedAnswerManage from '../../components/admin/ReportedAnswers/ReportedAnswerManage';
export default function AdminReportedQuestionManagePage() {
    return (
        <Div style={{ backgroundColor: 'black', height: "100dvh" }} >
            <Sidebar defaultCurrentLink={5} />
            <ReportedAnswerManage />
        </Div>
    )
}

const Div = styled.div`
  position:relative;
  overflow-y:auto;
`