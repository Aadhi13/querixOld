import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const getUserData = createAsyncThunk('userData/getUserData', async (user, thunkAPI) => {
    try {
        const token = localStorage.getItem('user');
        if (!token) return thunkAPI.rejectWithValue('no token');
        const response = (await axios.get("/user-data", {
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            withCredentials: true
        }));
        return response.data.data;
    } catch (err) {
        console.log('err',err.message);
        if (err.response.data.message == 'Invalid jwt token.' || err.response.data.message == 'Jwt expired.') {
            localStorage.removeItem('user');
            return thunkAPI.rejectWithValue(err.response.data.message)
        } else if (err.response.data.message == 'No jwt token.') {
            localStorage.removeItem('user')
            return thunkAPI.rejectWithValue(err.response.data.message)
        }
        return thunkAPI.rejectWithValue(err)
    }
});

const initialState = {
    userData: null
}

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('user');
            state.userData = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserData.fulfilled, (state, action) => {
            state.userData = action.payload
        });
        builder.addCase(getUserData.rejected, (state, action) => {
            state.userData = null
        });
    }

})

export { getUserData }

export const { logout } = userDataSlice.actions

export default userDataSlice.reducer