import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth'
import { modalErrorSlice } from './modalError'
import { modalPostWithCommentsSlice } from './modalPostWithComments'
import { postsFirestoreSlice } from './postsFirestore'

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        modalError: modalErrorSlice.reducer,
        modalPostWithComments: modalPostWithCommentsSlice.reducer,
        postsFirestore: postsFirestoreSlice.reducer

    }
})