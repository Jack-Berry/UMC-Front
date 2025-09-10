// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-neutral-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-brand-400">
          Welcome to the Useless Men's Co-operative!
        </h1>
        <p className="mb-6 text-gray-300">
          This is an early version of the app that’s live for testing. Here’s
          what you can try right now:
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-200 mb-6">
          <li>
            Access is password protected — only invited testers can get in.
          </li>
          <li>
            You can create an account or log in with an existing one (no real
            email required, but accounts are secure).
          </li>
          <li>
            Once logged in, you’ll land on your dashboard, which shows your
            progress and reminders.
          </li>
          <li>
            The{" "}
            <span className="font-semibold text-brand-400">
              Initial Assessment
            </span>{" "}
            is fully functional — complete it to unlock the rest of the app.
          </li>
          <li>
            You’ll see placeholders for{" "}
            <span className="italic">in-depth assessments</span>. These aren’t
            ready yet, but you can click them to preview how they’ll appear.
          </li>
          <li className="font-bold text-green-400">
            Click the logo in the top left to return to this page at any time.
          </li>
        </ul>

        <p className="mb-6 text-gray-400 italic">
          This is just the foundation — more assessments, stats, and awards are
          coming soon.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-10">
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
    </div>
  );
}
