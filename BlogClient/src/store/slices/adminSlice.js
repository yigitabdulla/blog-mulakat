import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

// Dashboard stats
export const getDashboardStats = createAsyncThunk('admin/getDashboardStats', async (_, thunkAPI) => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
  }
});

// Blogs
export const getAllBlogs = createAsyncThunk('admin/getAllBlogs', async (params, thunkAPI) => {
  try {
    const response = await api.get('/admin/blogs', { params });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
  }
});

export const deleteBlog = createAsyncThunk('admin/deleteBlog', async (id, thunkAPI) => {
  try {
    await api.delete(`/admin/blogs/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
  }
});

// Tournaments
export const getAllTournaments = createAsyncThunk('admin/getAllTournaments', async (params, thunkAPI) => {
  try {
    const response = await api.get('/admin/tournaments', { params });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch tournaments');
  }
});

export const deleteTournament = createAsyncThunk('admin/deleteTournament', async (id, thunkAPI) => {
  try {
    await api.delete(`/admin/tournaments/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete tournament');
  }
});

export const removeMatchVotes = createAsyncThunk('admin/removeMatchVotes', async ({ tournamentId, matchIndex }, thunkAPI) => {
  try {
    const response = await api.delete(`/admin/tournaments/${tournamentId}/matches/${matchIndex}/votes`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove match votes');
  }
});

// Users
export const getAllUsers = createAsyncThunk('admin/getAllUsers', async (params, thunkAPI) => {
  try {
    const response = await api.get('/admin/users', { params });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, thunkAPI) => {
  try {
    await api.delete(`/admin/users/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete user');
  }
});

const initialState = {
  dashboard: {
    stats: null,
    recentBlogs: [],
    recentTournaments: []
  },
  blogs: {
    data: [],
    pagination: null,
    loading: false,
    error: null
  },
  tournaments: {
    data: [],
    pagination: null,
    loading: false,
    error: null
  },
  users: {
    data: [],
    pagination: null,
    loading: false,
    error: null
  },
  loading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.blogs.error = null;
      state.tournaments.error = null;
      state.users.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Blogs
      .addCase(getAllBlogs.pending, (state) => {
        state.blogs.loading = true;
        state.blogs.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.blogs.loading = false;
        state.blogs.data = action.payload.blogs;
        state.blogs.pagination = action.payload.pagination;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.blogs.loading = false;
        state.blogs.error = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs.data = state.blogs.data.filter(blog => blog._id !== action.payload);
      })
      // Tournaments
      .addCase(getAllTournaments.pending, (state) => {
        state.tournaments.loading = true;
        state.tournaments.error = null;
      })
      .addCase(getAllTournaments.fulfilled, (state, action) => {
        state.tournaments.loading = false;
        state.tournaments.data = action.payload.tournaments;
        state.tournaments.pagination = action.payload.pagination;
      })
      .addCase(getAllTournaments.rejected, (state, action) => {
        state.tournaments.loading = false;
        state.tournaments.error = action.payload;
      })
      .addCase(deleteTournament.fulfilled, (state, action) => {
        state.tournaments.data = state.tournaments.data.filter(tournament => tournament._id !== action.payload);
      })
      // Users
      .addCase(getAllUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data = action.payload.users;
        state.users.pagination = action.payload.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users.data = state.users.data.filter(user => user._id !== action.payload);
      });
  }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;




