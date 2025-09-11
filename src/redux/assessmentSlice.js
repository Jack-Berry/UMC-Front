// src/redux/assessmentSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { fetchAssessment } from "../api/assessment";

// Async thunk for fetching a user's assessment by type
export const getAssessment = createAsyncThunk(
  "assessments/getAssessment",
  async ({ assessmentType, userId }, { rejectWithValue }) => {
    try {
      const data = await fetchAssessment(assessmentType, userId);
      return { assessmentType, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const assessmentSlice = createSlice({
  name: "assessments",
  initialState: {
    byType: {}, // keyed by assessmentType: { answers, completed }
    loading: false,
    error: null,
  },
  reducers: {
    resetAssessments: (state) => {
      state.byType = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssessment.fulfilled, (state, action) => {
        state.loading = false;
        const { assessmentType, data } = action.payload;
        console.log("Fetched assessment data:", assessmentType, data);
        state.byType[assessmentType] = {
          answers: data.answers || [],
          completed: (data.answers?.length || 0) > 0,
        };
      })
      .addCase(getAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assessment";
      });
  },
});

export const selectAssessmentStatus = createSelector(
  (state) => state.assessments.byType,
  (byType) => ({
    initial: byType.initial?.completed || false,
    inDepth: [
      { category: "DIY", completed: byType.DIY?.completed || false },
      {
        category: "Technology",
        completed: byType.Technology?.completed || false,
      },
      {
        category: "Self-care",
        completed: byType["Self-care"]?.completed || false,
      },
      {
        category: "Communication",
        completed: byType.Communication?.completed || false,
      },
      {
        category: "Community",
        completed: byType.Community?.completed || false,
      },
    ],
  })
);

export const { resetAssessments } = assessmentSlice.actions;
export default assessmentSlice.reducer;
