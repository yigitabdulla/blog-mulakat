import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slices/blogSlice';
import authReducer from './slices/authSlice';
import tournamentReducer from './slices/tournamentSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    auth: authReducer,
    tournament: tournamentReducer,
    admin: adminReducer,
  },
});

export default store;

