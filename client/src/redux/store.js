import { configureStore } from '@reduxjs/toolkit'
import userDataSlice from './features/userDataSlice'
import menuSlice from './features/menuSlice'

const store = configureStore({
    reducer: {
        userData: userDataSlice,
        menu: menuSlice
    }

})

export default store