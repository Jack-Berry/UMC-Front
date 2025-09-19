// src/pages/Home.jsx
import { Link } from "react-router-dom";
import Feed from "../components/Feed";
import WelcomeBanner from "../components/WelcomeBanner";
import EventsList from "../components/EventsList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10 flex justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <WelcomeBanner />
          <Feed />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <EventsList />
        </div>
      </div>
    </div>
  );
}
