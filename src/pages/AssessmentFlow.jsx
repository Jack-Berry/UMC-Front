// src/pages/AssessmentFlow.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  submitAssessment,
  fetchAssessment,
  fetchAssessmentQuestions,
} from "../api/assessment";
import { formatAssessmentQuestions } from "../utils/formatAssessment";

export default function AssessmentFlow() {
  const { type } = useParams(); // e.g. "initial" or "diy"
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = Number(storedUser?.id);

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flowData, setFlowData] = useState([]);
  const [comingSoon, setComingSoon] = useState(false);

  const LABELS = {
    1: "I am useless",
    2: "Below average",
    3: "Getting there",
    4: "I am useful",
    5: "Mastered it",
  };

  // inside useEffect in AssessmentFlow.jsx
  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetchAssessmentQuestions(type);
        console.log("🔍 API response for", type, ":", res);

        const raw = Array.isArray(res) ? res : res?.questions || [];
        console.log("🔍 Parsed raw questions:", raw);

        if (!raw.length) {
          console.warn("⚠️ No questions found for", type);
          setComingSoon(true);
          return;
        }

        const formatted = formatAssessmentQuestions(raw);
        console.log("✅ Formatted flowData:", formatted);

        setFlowData(formatted);
      } catch (err) {
        console.error("❌ Failed to load questions:", err);
        setComingSoon(true);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [type]);

  // 🔹 Pre-fill answers if they exist
  useEffect(() => {
    async function loadExisting() {
      try {
        const existing = await fetchAssessment(type, userId);
        if (existing.answers?.length && flowData.length > 0) {
          const prefilled = {};
          existing.answers.forEach((a) => {
            if (!prefilled[a.category]) prefilled[a.category] = [];
            const idx = flowData
              .find((c) => c.category === a.category)
              ?.questions.findIndex((q) => q.id === a.question_id);
            if (idx !== -1) {
              prefilled[a.category][idx] = a.score;
            }
          });
          setScores(prefilled);
        }
      } catch (err) {
        console.warn("No existing answers or failed to load", err);
      }
    }

    if (userId && type && flowData.length > 0) {
      loadExisting();
    }
  }, [type, userId, flowData]);

  // 🔹 Ensure follow-ups are injected when prefilled scores exist
  useEffect(() => {
    if (flowData.length === 0 || Object.keys(scores).length === 0) return;

    flowData.forEach((category) => {
      category.questions.forEach((q, idx) => {
        const score = scores[category.category]?.[idx];
        if (
          score >= (q.followUps?.minScore || 999) &&
          q.followUps?.questions?.length > 0
        ) {
          const followUpCategory = `${q.id}-advanced`;
          const hasFollowUps = flowData.some(
            (c) => c.category === followUpCategory
          );

          if (!hasFollowUps) {
            const followUpStep = {
              category: followUpCategory,
              title: `Advanced ${category.category}`,
              description: `Follow-up: ${q.text}`,
              questions: q.followUps.questions.map((fq) => ({
                ...fq,
                followUpsParent: q.id,
              })),
            };
            setFlowData((prev) => [...prev, followUpStep]);
          }
        }
      });
    });
  }, [flowData, scores]);

  const currentCategory = flowData[step];

  const handleChange = (questionIndex, value) => {
    const updated = { ...scores };
    if (!updated[currentCategory.category]) {
      updated[currentCategory.category] = [];
    }
    updated[currentCategory.category][questionIndex] = parseInt(value);
    setScores(updated);

    const q = currentCategory.questions[questionIndex];
    if (!q || !q.followUps) return;

    const followUpCategory = `${q.id}-advanced`;
    const hasFollowUps = flowData.some((c) => c.category === followUpCategory);

    if (value >= q.followUps.minScore) {
      if (!hasFollowUps && q.followUps.questions.length > 0) {
        const followUpStep = {
          category: followUpCategory,
          title: `Advanced ${currentCategory.category}`,
          description: `Follow-up: ${q.text}`,
          questions: q.followUps.questions.map((fq) => ({
            ...fq,
            followUpsParent: q.id,
          })),
        };
        setFlowData((prev) => [...prev, followUpStep]);
      }
    } else if (hasFollowUps) {
      setFlowData((prev) =>
        prev.filter((c) => c.category !== followUpCategory)
      );
      setScores((prev) => {
        const newScores = { ...prev };
        delete newScores[followUpCategory];
        return newScores;
      });
      if (currentCategory.category === followUpCategory && step > 0) {
        setStep(step - 1);
      }
    }
  };

  const handleNext = async () => {
    if (step < flowData.length - 1) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      try {
        const answers = [];
        flowData.forEach((cat) => {
          cat.questions.forEach((q, idx) => {
            const score = scores[cat.category]?.[idx];
            if (score !== undefined) {
              answers.push({
                questionId: q.id,
                questionText: q.text,
                category: cat.category,
                score,
                is_followup: !!q.followUpsParent,
              });
            }
          });
        });

        await submitAssessment({
          assessmentType: type,
          answers,
        });

        navigate("/dashboard");
      } catch (err) {
        console.error("Assessment submission failed", err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  if (loading) {
    return <p className="text-white">Loading assessment...</p>;
  }

  if (comingSoon) {
    return (
      <div className="text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Coming Soon 🚧</h2>
        <p>
          The <span className="capitalize">{type}</span> assessment isn’t ready
          yet — we’re working on it!
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 bg-brand-600 rounded hover:bg-brand-500 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const progress = Math.round(((step + 1) / flowData.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-white">
      <h2 className="text-2xl font-bold mb-4 capitalize">{type} Assessment</h2>
      <p className="text-gray-300 mb-6 max-w-xl">
        Let’s get a snapshot of where you're at. You can update this later to
        track progress and unlock insights.
      </p>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">
          {currentCategory.title || currentCategory.category}
        </h3>
        <p className="text-gray-400 mb-4">{currentCategory.description}</p>

        {currentCategory.questions.map((q, index) => (
          <div
            key={q.id}
            className="mb-6 border border-neutral-700 p-4 rounded-lg shadow-sm"
          >
            <p className="mb-3 font-medium text-base">{q.text}</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {[1, 2, 3, 4, 5].map((val) => {
                const isSelected =
                  scores[currentCategory.category]?.[index] === val;
                return (
                  <button
                    key={val}
                    onClick={() => handleChange(index, val)}
                    className={`flex flex-col items-center justify-center p-3 rounded-md border w-full sm:w-20 text-sm font-medium transition
                      ${
                        isSelected
                          ? "bg-brand-600 text-white border-brand-600"
                          : "bg-neutral-800 text-white border-gray-600 hover:bg-brand-600 hover:border-brand-600"
                      }
                    `}
                  >
                    <span className="text-lg font-bold">{val}</span>
                    <span className="text-xs text-gray-300 mt-1">
                      {LABELS[val]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-2 bg-neutral-700 rounded mb-6 overflow-hidden">
        <div
          className="h-full bg-brand-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between">
        {step > 0 ? (
          <button
            onClick={handleBack}
            className="px-6 py-2 rounded bg-neutral-700 hover:bg-neutral-600 transition text-white font-medium"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          disabled={
            !scores[currentCategory.category] ||
            scores[currentCategory.category].length !==
              currentCategory.questions.length ||
            scores[currentCategory.category].includes(undefined)
          }
          className="px-6 py-2 rounded bg-brand-600 hover:bg-brand-500 transition text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step < flowData.length - 1
            ? "Next"
            : submitting
            ? "Submitting..."
            : "Finish"}
        </button>
      </div>
    </div>
  );
}
