// src/redux/assessmentSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { fetchAssessment, fetchAssessmentQuestions } from "../api/assessment";

// Async thunk for fetching a user's assessment by type
export const getAssessment = createAsyncThunk(
  "assessments/getAssessment",
  async ({ assessmentType, userId }, { rejectWithValue }) => {
    try {
      // Fetch answers and questions in parallel
      const [answersRes, questionsRes] = await Promise.all([
        fetchAssessment(assessmentType, userId), // user’s answers
        fetchAssessmentQuestions(assessmentType), // full question set (with tags)
      ]);

      return {
        assessmentType,
        data: {
          answers: answersRes.answers || [],
          questions: questionsRes.questions || [],
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

// 🔹 Selector: get all answers across all assessments, enriched with tags
export const selectAnswersWithTags = createSelector(
  (state) => state.assessments.byType,
  (byType) => {
    const allAnswers = [];
    Object.entries(byType).forEach(
      ([type, { answers = [], questions = [] }]) => {
        // Build questionId -> tags lookup
        const lookup = {};
        questions.forEach((q) => {
          lookup[q.id] = q.tags || [];
        });

        // Merge tags into each answer
        answers.forEach((a) => {
          allAnswers.push({
            ...a,
            tags: lookup[a.questionId] || [],
            assessment_type: type,
          });
        });
      }
    );
    return allAnswers;
  }
);

export const { resetAssessments } = assessmentSlice.actions;
export default assessmentSlice.reducer;
