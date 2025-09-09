import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitAssessment } from "../api/assessment";
import { fetchUserById } from "../api/auth";
import assessmentData from "../data/assessmentData";

export default function AssessmentFlow() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [submitting, setSubmitting] = useState(false);

  console.log(storedUser);

  const LABELS = {
    1: "I am useless",
    2: "Below average",
    3: "Getting there",
    4: "I am useful",
    5: "Mastered it",
  };

  useEffect(() => {
    if (!storedUser) {
      navigate("/home");
      return;
    }
    if (storedUser.has_completed_assessment) {
      console.log(
        "Redirecting to Dashboard...",
        storedUser.has_completed_assessment
      );
      navigate("/dashboard");
    }
  }, [navigate]);

  const currentCategory = assessmentData[step];

  const handleChange = (questionIndex, value) => {
    const updated = { ...scores };
    if (!updated[currentCategory.category]) {
      updated[currentCategory.category] = [];
    }
    updated[currentCategory.category][questionIndex] = parseInt(value);
    setScores(updated);
  };

  const handleNext = async () => {
    if (step < assessmentData.length - 1) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      try {
        const scoresByCategory = {};
        for (const [category, answers] of Object.entries(scores)) {
          const avg =
            answers.reduce((acc, val) => acc + val, 0) / answers.length;
          scoresByCategory[category] = Math.round(avg);
        }

        await submitAssessment({ userId, scoresByCategory });
        const updatedUser = await fetchUserById(userId);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        navigate("/dashboard");
      } catch (err) {
        console.error("Assessment submission failed", err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const progress = Math.round(((step + 1) / assessmentData.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-white">
      <h2 className="text-2xl font-bold mb-4">Initial Assessment</h2>
      <p className="text-gray-300 mb-6 max-w-xl">
        Before you get started, let’s get a quick snapshot of where you're at.
        This will help us tailor your growth journey and unlock relevant tools,
        events, and matches.
      </p>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">
          {currentCategory.category}
        </h3>
        <p className="text-gray-400 mb-4">{currentCategory.description}</p>

        {currentCategory.questions.map((question, index) => (
          <div key={index} className="mb-6">
            <p className="mb-2 font-medium">{question}</p>
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4, 5].map((val) => {
                const isSelected =
                  scores[currentCategory.category]?.[index] === val;
                return (
                  <div key={val} className="flex flex-col items-center w-20">
                    <button
                      onClick={() => handleChange(index, val)}
                      className={`w-full py-2 rounded border text-sm font-semibold transition
                        ${
                          isSelected
                            ? "bg-brand-500 text-white border-brand-500"
                            : "bg-neutral-800 text-white border-gray-600 hover:bg-brand-600 hover:border-brand-600"
                        }
                      `}
                    >
                      {val}
                    </button>
                    <span className="text-s text-center mt-1 text-gray-400">
                      {LABELS[val]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-2 bg-gray-700 rounded mb-6">
        <div
          className="h-full rounded bg-white transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

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
        {step < assessmentData.length - 1
          ? "Next"
          : submitting
          ? "Submitting..."
          : "Finish"}
      </button>
    </div>
  );
}
