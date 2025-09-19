import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function WelcomeBanner() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-neutral-800 p-8 rounded-lg shadow-lg mb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-400 text-center w-full">
          Welcome to the Useless Men's <br /> Co-operative!
        </h1>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-4 flex items-center text-brand-400 hover:text-brand-300"
        >
          {expanded ? "Hide details" : "Show current feature list"}
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 text-gray-200">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="font-semibold">Create an account</span> quickly
              and log back in any time (no real email needed during testing).
            </li>
            <li>
              <span className="font-semibold">Dashboard</span> shows your
              profile, your progress, and any awards you’ve earned.
            </li>
            <li>
              <span className="font-semibold">Initial Assessment</span> is fully
              working, complete it to unlock the rest of the app.
            </li>
            <li>
              <span className="font-semibold">Profile editing</span> lets you
              update your details and upload a profile picture (take one on
              mobile, upload on desktop).
            </li>
            <li>
              <span className="font-semibold">Friends list</span> (test version)
              shows who’s online and lets you add new people.
            </li>
            <li>
              <span className="font-semibold">Skill Swap Matches</span> (test
              version) give you a preview of how members will be matched based
              on what they’re useful and useless at.
            </li>
            <li>
              <span className="font-semibold">Community Feed</span> gives a live
              sense of posts and updates.
            </li>
            <li>
              <span className="font-semibold">Events and News</span> (coming
              soon) will highlight workshops, meet-ups, and community articles
              right on the homepage.
            </li>
            <li>
              <span className="font-semibold">Admin Portal</span> allows
              designated admins to create, edit, and manage assessment questions
              and categories directly.
            </li>
            <li className="font-bold text-green-400">
              Always return home by clicking the logo in the top-left corner.
            </li>
          </ul>

          <p className="text-gray-400 italic">
            This is just the start — more features, stats, and awards are on the
            way.
          </p>
        </div>
      )}
    </div>
  );
}
