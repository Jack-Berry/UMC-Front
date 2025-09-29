// src/pages/Home.jsx
import { useSelector } from "react-redux";
import Feed from "../components/Feed";
import WelcomeBanner from "../components/WelcomeBanner";
import EventsList from "../components/EventsList";

export default function Home() {
  const user = useSelector((s) => s.user.current);

  const hasCoords =
    user && typeof user.lat === "number" && typeof user.lng === "number";

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10 flex justify-center">
      <div
        className={`max-w-6xl w-full gap-8 ${
          user ? "grid grid-cols-1 lg:grid-cols-3" : "flex flex-col"
        }`}
      >
        {/* Left/Main Column */}
        <div className={user ? "lg:col-span-2 space-y-8" : "space-y-8 w-full"}>
          <WelcomeBanner />
          <Feed />
        </div>

        {/* Right Sidebar (only if logged in AND has coords) */}
        {hasCoords && (
          <div className="space-y-6">
            <EventsList userLat={user.lat} userLng={user.lng} />
          </div>
        )}
      </div>
    </div>
  );
}
