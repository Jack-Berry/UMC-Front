import { useState } from "react";
import { Link } from "react-router-dom";
import Feed from "../components/Feed";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-10">
      <div className="max-w-2xl w-full bg-neutral-800 p-8 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-4 text-brand-400">
          Welcome to the Useless Men's Co-operative!
        </h1>
        <p className="mb-4 text-gray-300">
          This is an early version of the app that’s live for testing. Here’s
          what you can try right now:
        </p>

        {/* Collapsible feature box */}
        <div className="bg-neutral-700 rounded-md p-4 mb-6">
          <button
            className="flex items-center justify-between w-full text-left font-semibold text-brand-400 hover:text-brand-300"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide details" : "Current Features"}
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {expanded && (
            <div className="mt-4 space-y-3 text-gray-200">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Create an account (no real email required) or log in with an
                  existing one.
                </li>
                <li>
                  Your <span className="font-semibold">dashboard</span> shows
                  your profile card, progress, and awards.
                </li>
                <li>
                  The{" "}
                  <span className="font-semibold text-brand-400">
                    Initial Assessment
                  </span>{" "}
                  works fully — complete it to unlock the rest of the app.
                </li>
                <li>
                  Extra <span className="italic">in-depth assessments</span> are
                  listed as previews (coming soon).
                </li>
                <li>
                  You can now edit your profile on your dashboard and upload a
                  profile picture. On mobile this also allows you to take one,
                  but desktop is upload only.
                </li>
                <li>
                  A mock <span className="font-semibold">Friends list</span>{" "}
                  lets you see who’s online and add new people.
                </li>
                <li>
                  <span className="font-semibold">Skill Swap Matches</span> will
                  connect you with others based on what you’re useful and
                  useless at. Currently a mock up too.
                </li>
                <li>
                  The{" "}
                  <span className="font-semibold text-brand-400">
                    Community Feed
                  </span>{" "}
                  below gives a live sense of posts and updates.
                </li>
                <li className="font-bold text-green-400">
                  Click the logo in the top left at any time to come back here.
                </li>
              </ul>

              <p className="text-gray-400 italic">
                This is just the foundation — more features, stats, and awards
                are on the way.
              </p>
            </div>
          )}
        </div>

        {/* Auth buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/login"
            className="bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded text-center font-medium"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-center font-medium"
          >
            Create an Account
          </Link>
        </div>
      </div>

      {/* Demo feed */}
      <div className="max-w-2xl mx-auto w-full">
        <Feed />
      </div>
    </div>
  );
}
