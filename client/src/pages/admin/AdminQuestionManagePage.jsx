import React from 'react'
import styled from 'styled-components';
import Sidebar from '../../components/admin/Dashboard/Sidebar';
import QuestionManage from '../../components/admin/Questions/QuestionManage';
export default function AdminQuestionManagePage() {
    return (
        <Div style={{ backgroundColor: 'black', height: "100vh" }} >
            <Sidebar defaultCurrentLink={3}/>
            <QuestionManage />
            
        </Div>
    )
}

const Div = styled.div`
  position:relative;
  overflow-y:auto;
`