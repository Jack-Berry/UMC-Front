import { Link } from "react-router-dom";
import Feed from "../components/Feed";
import WelcomeBanner from "../components/WelcomeBanner";
import EventsList from "../components/EventsList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-10">
      <div className="max-w-2xl w-full">
        <WelcomeBanner />

        {/* News Feed */}
        <Feed />

        <div className="mt-12">
          <EventsList />
        </div>
        {/* <EventsPreview /> */}
      </div>
    </div>
  );
}
