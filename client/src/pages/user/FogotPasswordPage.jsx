import React, { useState } from 'react'
import ForgotPassword from '../../components/user/Forgot Password/ForgotPassword'
import OtpVerify from '../../components/user/Forgot Password/OtpVerify'
import NewPassword from '../../components/user/Forgot Password/NewPassword'

function FogotPasswordPage() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({});
    const [token, setToken] = useState(null);

    const handleForgotPasswordSubmit = (userData) => {
        setData(userData);
        setStep(2);
    }

    const handleOtpVerifySubmit = (authData) => {
        setStep(authData.state);
        setToken(authData.token);
    }
    return (
        <>
            {step === 1 && <ForgotPassword onSubmit={(userData) => handleForgotPasswordSubmit(userData)} />}
            {step === 2 && <OtpVerify onSubmit={(authData) => handleOtpVerifySubmit(authData)} data={data} />}
            {step === 3 && <NewPassword token={token}/>}
        </>
    )
}

export default FogotPasswordPage