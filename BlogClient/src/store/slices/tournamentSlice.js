import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/client';

export const createTournament = createAsyncThunk('tournament/create', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/tournaments', payload);
    return res.data.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to create tournament');
  }
});

export const fetchTournaments = createAsyncThunk('tournament/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await api.get('/tournaments');
    return res.data.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to fetch tournaments');
  }
});

export const fetchTournamentById = createAsyncThunk('tournament/fetchById', async (id, thunkAPI) => {
  try {
    const res = await api.get(`/tournaments/${id}`);
    return res.data.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to fetch tournament');
  }
});

export const voteMatch = createAsyncThunk('tournament/vote', async ({ id, index, pick }, thunkAPI) => {
  try {
    const res = await api.post(`/tournaments/${id}/matches/${index}/vote`, { pick });
    return { id, index, match: res.data.data };
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to vote');
  }
});

export const registerTournament = createAsyncThunk('tournament/register', async ({ id, blogId }, thunkAPI) => {
  try {
    const res = await api.post(`/tournaments/${id}/register`, { blogId });
    return res.data.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to register');
  }
});

export const startTournament = createAsyncThunk('tournament/start', async (id, thunkAPI) => {
  try {
    const res = await api.post(`/tournaments/${id}/start`);
    return res.data.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to start');
  }
});

export const deleteTournament = createAsyncThunk('tournament/delete', async (id, thunkAPI) => {
  try {
    await api.delete(`/tournaments/${id}`);
    return id;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to delete');
  }
});

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState: { items: [], selected: null, isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournaments.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTournaments.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload; })
      .addCase(fetchTournaments.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(fetchTournamentById.pending, (state) => { state.isLoading = true; state.error = null; state.selected = null; })
      .addCase(fetchTournamentById.fulfilled, (state, action) => { state.isLoading = false; state.selected = action.payload; })
      .addCase(fetchTournamentById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(createTournament.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(registerTournament.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(startTournament.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTournament.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
      })
      .addCase(voteMatch.fulfilled, (state, action) => {
        const { id, index, match } = action.payload;
        const tIdx = state.items.findIndex(t => t._id === id);
        if (tIdx !== -1 && state.items[tIdx].matches) {
          state.items[tIdx].matches[index] = match;
        }
        if (state.selected && state.selected._id === id && state.selected.matches) {
          state.selected.matches[index] = match;
        }
      });
  }
});

export default tournamentSlice.reducer;


