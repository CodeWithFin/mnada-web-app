import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import postsSlice from './slices/postsSlice'
import productsSlice from './slices/productsSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    products: productsSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Type the useSelector hook
export const useAppSelector = (selector: (state: RootState) => any) => selector
export const useAppDispatch = () => store.dispatch
