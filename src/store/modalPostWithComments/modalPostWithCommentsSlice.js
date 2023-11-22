
import { createSlice } from "@reduxjs/toolkit"

export const modalPostWithCommentsSlice = createSlice({
    name: 'modalPostWithComments',
    initialState: {
        currentUser: {},
        post: null,
        urlImagePost: null,
        datePosted: null,
        commentsFirestore: [],
    },

    reducers: {
        setPostWithComments: (state, action) => {
            state.currentUser = action.payload.currentUser
            state.post = action.payload.post
            state.urlImagePost = action.payload.urlImagePost
            state.datePosted = action.payload.datePosted
            state.commentsFirestore = action.payload.commentsFirestore
        }
    }


})

export const { setPostWithComments } = modalPostWithCommentsSlice.actions
