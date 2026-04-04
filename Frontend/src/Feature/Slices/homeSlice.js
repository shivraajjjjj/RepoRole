import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
    name: 'repo',
    initialState: {
        repoData: null,
        error: null,
        loading: false,
        page: 'result',
        theme: localStorage.getItem("theme") || "dark"
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
        setPage: (state, action) => {
            state.page = action.payload
        },
        resetFlow: (state) => {
            state.page = "landing";
            state.error = null;
            state.repoData = null;
        },
        setTheme: (state, action) => {
            state.theme = action.payload
        }
    }
})

export const { setData, setTheme, setError, setLoading, setPage, resetFlow } = homeSlice.actions

export default homeSlice.reducer