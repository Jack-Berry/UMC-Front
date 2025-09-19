// src/redux/newsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNews,
  fetchNewsById,
  createNews,
  updateNews,
  deleteNews,
  uploadNewsImage,
  fetchLinkPreview,
} from "../api/news";

// 🔹 Thunks
export const getNews = createAsyncThunk("news/getAll", async (_, thunkAPI) => {
  try {
    return await fetchNews();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const getNewsById = createAsyncThunk(
  "news/getById",
  async (id, thunkAPI) => {
    try {
      return await fetchNewsById(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const addNews = createAsyncThunk(
  "news/create",
  async (data, thunkAPI) => {
    try {
      return await createNews(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const editNews = createAsyncThunk(
  "news/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateNews(id, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const removeNews = createAsyncThunk(
  "news/delete",
  async (id, thunkAPI) => {
    try {
      await deleteNews(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "news/uploadImage",
  async (file, thunkAPI) => {
    try {
      return await uploadNewsImage(file);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getLinkPreview = createAsyncThunk(
  "news/linkPreview",
  async (url, thunkAPI) => {
    try {
      return await fetchLinkPreview(url);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 🔹 Slice
const newsSlice = createSlice({
  name: "news",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all
      .addCase(getNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.news || [];
      })
      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get single
      .addCase(getNewsById.fulfilled, (state, action) => {
        state.current = action.payload;
      })

      // Create
      .addCase(addNews.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // Update
      .addCase(editNews.fulfilled, (state, action) => {
        const idx = state.list.findIndex((n) => n.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      // Delete
      .addCase(removeNews.fulfilled, (state, action) => {
        state.list = state.list.filter((n) => n.id !== action.payload);
      });
  },
});

export default newsSlice.reducer;
