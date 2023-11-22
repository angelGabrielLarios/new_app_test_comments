import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth'
import { modalErrorSlice } from './modalError'
import { modalPostWithCommentsSlice } from './modalPostWithComments'

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        modalError: modalErrorSlice.reducer,
        modalPostWithComments: modalPostWithCommentsSlice.reducer

    }
})