import { configureStore, createSlice } from '@reduxjs/toolkit';

/**
 * Example global redux state.
 */
export const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1
  }
});

/**
 * Redux store.
 */
export const store = configureStore({
  reducer: counterSlice.reducer
});

export type RootState = ReturnType<typeof counterSlice.reducer>;
