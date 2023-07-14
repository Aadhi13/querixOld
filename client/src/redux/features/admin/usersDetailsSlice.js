import { createSlice } from "@reduxjs/toolkit";

export const usersDetailsSlice = createSlice({
    name:"usersDetails",
    initialState:{
        usersDetails:[]
    },
    reducers:{
        setUsersDetails:(state,action)=>{
            state.usersDetails= action.payload;

        }
    }
})


export const {setUsersDetails} = usersDetailsSlice.actions;