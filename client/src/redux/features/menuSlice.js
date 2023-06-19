import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    headerMenuShow: false
}

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        menuShowHide: (state) => {
            state.headerMenuShow = !state.headerMenuShow
        },
        menuHide: (state) => {
            state.headerMenuShow = false
        },
    }
})

export const {menuShowHide, menuHide} = menuSlice.actions

export default menuSlice.reducer