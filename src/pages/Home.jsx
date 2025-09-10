// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-neutral-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-brand-400">
          Welcome to the Useless Men's Co-operative!
        </h1>
        <p className="mb-6 text-gray-300">
          This is an early version of the app for testing purposes. Here's what
          you can try right now:
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-200 mb-6">
          <li>
            There is a password protected gate preventing public access to the
            website
          </li>
          <li>
            You can create an account or log in with an existing one. So far
            this doesn't require a real email address or anything, but is
            secure.
          </li>
          <li>
            Once logged in, you can view the basic mock up dashboard area.
          </li>
          <li>
            There's a first draft of the assessment form — feel free to fill it
            in.
          </li>
          <li>
            You can log out or reset your access using the buttons at the top.
            This simulates a new user visiting the site.
          </li>
          <li className="font-bold text-green-400">
            If you want to come back to this page then click the logo in the top
            left.
          </li>
        </ul>

        <p className="mb-6 text-gray-400 italic">
          This version is just a starting point. More features and polish will
          be added soon!
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
