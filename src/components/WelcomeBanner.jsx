// src/components/WelcomeBanner.jsx
import React from "react";
import { Users, Lightbulb, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function WelcomeBanner() {
  const user = useSelector((s) => s.user.current);

  const resolvedName =
    user?.display_name || user?.first_name || user?.last_name || "";

  // Framer Motion animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const child = {
    hidden: { opacity: 0, y: `0.25em` },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  // 🔹 Logged-in view with animated text
  if (user) {
    const text = `Hello${resolvedName ? `, ${resolvedName}` : ""}`;
    const letters = text.split("");

    return (
      <section className="mb-10 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-white"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {letters.map((char, i) => (
            <motion.span key={i} variants={child} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>
      </section>
    );
  }

  // 🔹 Logged-out view (hero with 3 pillars + CTA)
  return (
    <section className="bg-neutral-800 p-10 rounded-lg shadow-lg mb-10 text-center">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-brand-400 mb-6">
        Welcome to the Useless Men's Co-operative
      </h1>

      {/* Mission Statement */}
      <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto mb-8">
        A community where men come together to identify their strengths,
        strengthen their weaknesses, and share skills with one another. Our goal
        is to help every member grow into a more capable, well-rounded, and
        confident man.
      </p>

      {/* Three pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10">
        <div className="flex flex-col items-center bg-neutral-900 p-6 rounded-xl shadow-md">
          <Lightbulb className="text-brand-400 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2 text-white">Learn</h3>
          <p className="text-gray-400">
            Fill in the blind spots in your knowledge by exploring new skills
            and perspectives.
          </p>
        </div>
        <div className="flex flex-col items-center bg-neutral-900 p-6 rounded-xl shadow-md">
          <Users className="text-brand-400 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2 text-white">Connect</h3>
          <p className="text-gray-400">
            Meet others who are on the same journey — share your strengths and
            support one another.
          </p>
        </div>
        <div className="flex flex-col items-center bg-neutral-900 p-6 rounded-xl shadow-md">
          <TrendingUp className="text-brand-400 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2 text-white">Grow</h3>
          <p className="text-gray-400">
            Build confidence and become a more useful, capable man by developing
            real, practical skills.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div>
        <Link
          to="/register"
          className="inline-block bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Start Your Journey
        </Link>
      </div>
    </section>
  );
}
