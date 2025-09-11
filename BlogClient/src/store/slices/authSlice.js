import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/auth/register', payload);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/auth/login', payload);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('/auth/logout');
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const response = await api.get('/auth/me');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetch user failed');
  }
});

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(register.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(getMe.pending, (state) => { state.isLoading = true; /* don't touch error here */ })
      .addCase(getMe.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(getMe.rejected, (state) => { state.isLoading = false; state.user = null; /* intentionally do not set global error */ })
      .addCase(logout.fulfilled, (state) => { state.user = null; })
      .addCase(logout.rejected, (state, action) => { state.error = action.payload; });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;






