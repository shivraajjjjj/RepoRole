import {configureStore} from '@reduxjs/toolkit'
import repoReducer from '../Feature/Slices/homeSlice.js'
const store=configureStore({
    reducer:{
        repo:repoReducer
    }
})


export default store