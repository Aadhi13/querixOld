import { configureStore } from '@reduxjs/toolkit'

import userDataSlice from './features/user/userDataSlice'
import menuSlice from './features/user/menuSlice'

import adminDataSlice from './features/admin/adminDataSlice'
import { usersDetailsSlice } from './features/admin/usersDetailsSlice'

const store = configureStore({
    reducer: {
        adminData: adminDataSlice,
        userData: userDataSlice,
        menu: menuSlice,
        usersDetails: usersDetailsSlice.reducer,
        //name:reducer(?)
    }

})

export default store