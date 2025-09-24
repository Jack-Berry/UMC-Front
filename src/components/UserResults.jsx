// src/components/UserResults.jsx
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useSwipeable } from "react-swipeable";
import { ClipboardList } from "lucide-react";
import CategoryGraphs from "./CategoryGraphs";
import SkillsOverview from "./SkillsOverview";
import { selectAllAnswers } from "../utils/selectAllAnswers";
import AssessmentReminder from "./AssessmentReminder";

export default function UserResults() {
  const assessments = useSelector((state) => state.assessments.byType);
  const allAnswers = selectAllAnswers(assessments);

  // 🔹 detect if user has completed *any* in-depth assessments
  const hasInDepthData = Object.entries(assessments).some(
    ([type, data]) => type !== "initial" && data?.completed
  );

  const slides = useMemo(
    () => [
      {
        key: "category-overview",
        title: "Category Overview",
        render: () =>
          hasInDepthData ? (
            <CategoryGraphs answers={allAnswers} />
          ) : (
            <div className="flex flex-col items-center justify-center p-10 bg-neutral-800/60 rounded-lg text-center">
              <ClipboardList className="w-10 h-10 text-brand-400 mb-3" />
              <p className="text-gray-200 text-lg font-medium mb-1">
                No results yet
              </p>
              <p className="text-gray-400 text-sm max-w-md">
                Complete the assessments to unlock insights and see your
                progress visualised here.
              </p>
            </div>
          ),
      },
      {
        key: "skills-overview",
        title: "Skills Overview",
        render: () => <SkillsOverview answers={allAnswers} />,
      },
    ],
    [allAnswers, hasInDepthData]
  );

  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(slides.length - 1, i + 1));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    trackMouse: true,
  });

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  return (
    <div className="text-white">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Results</h2>
          <div className="text-sm text-gray-400">
            {index + 1} / {slides.length}
          </div>
        </div>
        {/* Put AssessmentReminder under heading */}
        <div className="mt-1">
          <AssessmentReminder />
        </div>
      </div>

      <div className="relative" {...swipeHandlers}>
        {/* Slides */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.key} className="min-w-full">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold">{slide.title}</h3>
                </div>
                {slide.render()}
              </div>
            ))}
          </div>
        </div>

        {/* Nav buttons */}
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-neutral-800/80 border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-700 disabled:opacity-40"
        >
          ◀
        </button>
        <button
          onClick={goNext}
          disabled={index === slides.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-neutral-800/80 border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-700 disabled:opacity-40"
        >
          ▶
        </button>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-brand-500" : "bg-neutral-600"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
