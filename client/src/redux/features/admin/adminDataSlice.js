import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../api/axios";

const getAdminData = createAsyncThunk("adminData/getAdminData", async (admin, thunkAPI) => {
        try {
            const token = localStorage.getItem("admin");
            if (!token) return thunkAPI.rejectWithValue("no token");
            const response = await axios.get("/admin/admin-data", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                withCredentials: true,
            });
            return response.data.data;
        } catch (err) {
            console.log('err',err);
            if (err.response.data.message == "Invalid jwt token." || err.response.data.message == "Jwt expired." || err.response.data.message == "No jwt token.") {
                localStorage.removeItem("admin");
                return thunkAPI.rejectWithValue(err.response.data.message);
            }
            return thunkAPI.rejectWithValue(err);
        }
    }
);

const initialState = {
    adminData: null,
};

const adminDataSlice = createSlice({
    name: "adminData",
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem("admin");
            state.adminData = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAdminData.fulfilled, (state, action) => {
            state.adminData = action.payload;
        });
        builder.addCase(getAdminData.rejected, (state, action) => {
            state.adminData = null;
        });
    },
});

export { getAdminData };

export const { logout } = adminDataSlice.actions;

export default adminDataSlice.reducer;