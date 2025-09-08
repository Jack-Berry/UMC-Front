// src/pages/AssessmentFlow.jsx
import React, { useState } from "react";
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
  const LABELS = {
    1: "I am useless",
    2: "Below average",
    3: "Getting there",
    4: "I am useful",
    5: "Mastered it",
  };

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
    <div className="assessment-container">
      <h2>Initial Assessment</h2>
      <p style={{ maxWidth: "500px" }}>
        Before you get started, let’s get a quick snapshot of where you're at.
        This will help us tailor your growth journey and unlock relevant tools,
        events, and matches.
      </p>

      <div style={{ margin: "20px 0" }}>
        <strong>{currentCategory.category}</strong>
        <p>{currentCategory.description}</p>

        {currentCategory.questions.map((question, index) => (
          <div key={index} style={{ marginBottom: "12px" }}>
            <label>
              {question}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "10px",
                }}
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <div
                    key={val}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "80px",
                    }}
                  >
                    <button
                      onClick={() => handleChange(index, val)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        background:
                          scores[currentCategory.category]?.[index] === val
                            ? "#0070f3"
                            : "#f0f0f0",
                        color:
                          scores[currentCategory.category]?.[index] === val
                            ? "#fff"
                            : "#000",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      {val}
                    </button>
                    <span
                      style={{
                        fontSize: "12px",
                        marginTop: "4px",
                        textAlign: "center",
                      }}
                    >
                      {LABELS[val]}
                    </span>
                  </div>
                ))}
              </div>
            </label>
          </div>
        ))}
      </div>

      <div
        style={{
          margin: "20px 0",
          width: "100%",
          background: "#eee",
          height: "8px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#0070f3",
          }}
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
        style={{ marginTop: "10px" }}
      >
        {step < assessmentData.length - 1 ? "Next" : "Finish"}
      </button>
    </div>
  );
}
