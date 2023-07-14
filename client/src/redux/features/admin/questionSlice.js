import { createSlice } from "@reduxjs/toolkit";

export const questionsSlice = createSlice({
    name:"questions",
    initialState:{
        questionsDetails:[],
    },
    reducers:{
        setQuestionsDetails:(state,action)=>{
            state.questionsDetails = [...state.questionsDetails, ...action.payload];
        },
        filterQuestionsDetails:(state,action)=>{
            
            state.questionsDetails = action.payload;
        }
    }
})



export const {setQuestionsDetails,filterQuestionsDetails} = questionsSlice.actions;
export default questionsSlice.reducer;