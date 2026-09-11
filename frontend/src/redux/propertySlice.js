import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProperties } from '../services/propertyService';

// Async thunk to fetch properties from backend API
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProperties();
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch properties';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  properties: [],
  loading: false,
  error: null,
};

export const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
        state.error = null;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch properties';
      });
  },
});

export default propertySlice.reducer;
