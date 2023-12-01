import { createSlice } from "@reduxjs/toolkit"



export const postsFirestoreSlice = createSlice({
    name: 'postsFirestore',
    initialState: [],
    reducers: {
        setPostsFirestore: (state, action) => {
            state = [...action.payload]
        }
    }
})


export const { setPostsFirestore } = postsFirestoreSlice.actions
