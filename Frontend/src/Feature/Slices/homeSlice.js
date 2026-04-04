import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
    name: 'repo',
    initialState: {
        repoData: null,
        error: null,
        loading: false,
        page: 'result'
    },
    reducers: {
        setData: (state, action) => {
            state.repoData = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        resetFlow: (state) => {
            state.page = "landing";
            state.error = null;
            state.repoData = null;
        },
    }
})

export const {setData,setError,setLoading,resetFlow}=homeSlice.actions

export default homeSlice.reducer