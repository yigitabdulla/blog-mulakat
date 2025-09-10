import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchBlogs = createAsyncThunk('blog/fetchAll', async (params, thunkAPI) => {
  try {
    const response = await api.get('/blogs', { params });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
  }
});

export const createBlog = createAsyncThunk('blog/create', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/blogs', payload);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create blog');
  }
});

export const updateBlogById = createAsyncThunk('blog/update', async ({ id, updates }, thunkAPI) => {
  try {
    const response = await api.put(`/blogs/${id}`, updates);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update blog');
  }
});

export const deleteBlogById = createAsyncThunk('blog/delete', async (id, thunkAPI) => {
  try {
    await api.delete(`/blogs/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
  }
});

export const fetchMyBlogs = createAsyncThunk('blog/fetchMyBlogs', async (params, thunkAPI) => {
  try {
    const response = await api.get('/blogs/user/my-blogs', { params });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch your blogs');
  }
});

const initialState = {
  posts: [],
  myPosts: [],
  currentComparison: null,
  votingHistory: [],
  isLoading: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCurrentComparison: (state, action) => {
      state.currentComparison = action.payload;
    },
    addVote: (state, action) => {
      const { postId, isWinner } = action.payload;
      state.votingHistory.push({ postId, isWinner, timestamp: Date.now() });
      
      // Update post vote counts (placeholder for now)
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.votes = (post.votes || 0) + 1;
        post.wins = (post.wins || 0) + (isWinner ? 1 : 0);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchBlogs.fulfilled, (state, action) => { state.isLoading = false; state.posts = action.payload; })
      .addCase(fetchBlogs.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(createBlog.fulfilled, (state, action) => { state.posts.unshift(action.payload); })
      .addCase(updateBlogById.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(deleteBlogById.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p._id !== action.payload);
        state.myPosts = state.myPosts.filter(p => p._id !== action.payload);
      })
      .addCase(fetchMyBlogs.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchMyBlogs.fulfilled, (state, action) => {
        state.myPosts = action.payload;
      })
      .addCase(fetchMyBlogs.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {
  setLoading,
  setError,
  setCurrentComparison,
  addVote,
  clearError,
} = blogSlice.actions;

export default blogSlice.reducer;
