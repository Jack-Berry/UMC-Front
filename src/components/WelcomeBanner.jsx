import React from "react";
import { Users, Lightbulb, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function WelcomeBanner() {
  const user = useSelector((s) => s.user.current);

  // Logged-in view (compressed)
  if (user) {
    return (
      <section className="bg-neutral-800 p-6 rounded-lg shadow-md mb-8 text-center">
        <h1 className="text-2xl font-bold text-brand-400">
          Welcome back{user.name ? `, ${user.name}` : ""}!
        </h1>
      </section>
    );
  }

  // Logged-out view (full hero)
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
