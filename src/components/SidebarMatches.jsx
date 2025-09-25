import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatches } from "../redux/matchesSlice";
import { Link } from "react-router-dom";
import Crest from "../assets/Crest.png";

export default function SidebarMatches() {
  const dispatch = useDispatch();
  const { items: matches, loading, error } = useSelector((s) => s.matches);

  useEffect(() => {
    // Fetch on mount (default 50 km)
    dispatch(fetchMatches({ distanceKm: 100, minScore: 80 }));
  }, [dispatch]);

  if (loading) {
    return <div className="p-4 text-sm text-gray-400">Loading matches...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-400">{error}</div>;
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-400">No matches found nearby.</div>
    );
  }

  const topMatches = matches.slice(0, 3);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-white mb-3">Skill Matches</h3>
      <ul className="space-y-3">
        {topMatches.map((m) => (
          <li
            key={m.id}
            className="flex items-center space-x-3 rounded-lg bg-neutral-800 p-2 hover:bg-neutral-700 transition"
          >
            <img
              src={m.avatar ? m.avatar : Crest}
              alt={`${m.name}'s avatar`}
              className="w-12 h-12 rounded-full object-cover border border-neutral-600"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{m.name}</p>
              <p className="text-xs text-gray-400">
                Match score: {m.matchScore}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-right">
        <Link
          to="/matches"
          className="text-sm text-brand-400 hover:text-brand-300"
        >
          View all →
        </Link>
      </div>
    </div>
  );
}
