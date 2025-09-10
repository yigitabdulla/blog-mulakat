import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slices/blogSlice';
import authReducer from './slices/authSlice';
import tournamentReducer from './slices/tournamentSlice';

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    auth: authReducer,
    tournament: tournamentReducer,
  },
});

export default store;

