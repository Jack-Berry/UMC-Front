// src/redux/assessmentSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import apiFetch from "../api/apiClient";

// 🔹 Fetch all live results for a given user (answers + tags + question_text direct from DB)
export const fetchUserResults = createAsyncThunk(
  "assessments/fetchUserResults",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`/api/assessment/results/${userId}`);
      return res; // array of { answer_id, question_text, tags[], score, assessment_type, ... }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Fetch a specific assessment type (kept for compatibility if you still use it anywhere)
export const getAssessment = createAsyncThunk(
  "assessments/getAssessment",
  async ({ assessmentType, userId }, { rejectWithValue }) => {
    try {
      // Old way: parallel answers/questions
      // Now simplified: answers always come from results API
      const res = await apiFetch(`/api/assessment/results/${userId}`);
      const filtered = (res || []).filter(
        (a) => a.assessment_type === assessmentType
      );

      return {
        assessmentType,
        data: {
          answers: filtered,
          questions: [], // we no longer need to enrich with stale questions
        },
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const assessmentSlice = createSlice({
  name: "assessments",
  initialState: {
    byType: {}, // keyed by assessmentType: { answers, questions, completed }
    results: [], // flat array of all live results
    loading: false,
    error: null,
  },
  reducers: {
    resetAssessments: (state) => {
      state.byType = {};
      state.results = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all results
      .addCase(fetchUserResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload || [];

        // Rebuild byType for compatibility with existing selectors/components
        const grouped = {};
        state.results.forEach((r) => {
          if (!grouped[r.assessment_type]) {
            grouped[r.assessment_type] = {
              answers: [],
              questions: [],
              completed: false,
            };
          }
          grouped[r.assessment_type].answers.push(r);
        });
        Object.keys(grouped).forEach((type) => {
          grouped[type].completed = grouped[type].answers.length > 0;
        });
        state.byType = grouped;
      })
      .addCase(fetchUserResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch results";
      })

      // Get a single assessment type
      .addCase(getAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssessment.fulfilled, (state, action) => {
        state.loading = false;
        const { assessmentType, data } = action.payload;
        state.byType[assessmentType] = {
          answers: data.answers || [],
          questions: data.questions || [],
          completed: (data.answers?.length || 0) > 0,
        };
      })
      .addCase(getAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assessment";
      });
  },
});

// 🔹 Selector: assessment completion status (unchanged)
export const selectAssessmentStatus = createSelector(
  (state) => state.assessments.byType,
  (byType) => ({
    initial: byType.initial?.completed || false,
    inDepth: [
      {
        category: "DIY",
        slug: "diy",
        completed: byType.diy?.completed || false,
      },
      {
        category: "Technology",
        slug: "technology",
        completed: byType.technology?.completed || false,
      },
      {
        category: "Self-care",
        slug: "self-care",
        completed: byType["self-care"]?.completed || false,
      },
      {
        category: "Communication",
        slug: "communication",
        completed: byType.communication?.completed || false,
      },
      {
        category: "Community",
        slug: "community",
        completed: byType.community?.completed || false,
      },
    ],
  })
);

// 🔹 Selector: get all answers (flat, always live)
export const selectAllAnswers = (state) => state.assessments.results || [];

// 🔹 Selector: answers grouped by type (still available for existing components)
export const selectAssessmentsByType = (state) =>
  state.assessments.byType || {};

export const { resetAssessments } = assessmentSlice.actions;
export default assessmentSlice.reducer;
