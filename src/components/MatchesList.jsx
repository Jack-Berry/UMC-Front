// src/components/MatchesList.jsx
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatches, searchMatches } from "../redux/matchesSlice";
import apiClient from "../api/apiClient";
import { UserPlus, MessageCircle, Ruler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../redux/friendsSlice";
import { startThread } from "../redux/messagesSlice";
import UserCard from "./UserCard";
import Crest from "../assets/Crest.png";

export default function MatchesList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((s) => s.user.current);
  const { items: matches, loading, error } = useSelector((s) => s.matches);
  const friends = useSelector((s) => s.friends.list) || [];

  // ---------- Local state ----------
  const [unit, setUnit] = useState("km");
  const [sortBy, setSortBy] = useState("score"); // "score" | "distance"
  const [distanceRange, setDistanceRange] = useState(100);

  // search by skill
  const [skill, setSkill] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [skillResults, setSkillResults] = useState([]);
  const [skillLoading, setSkillLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // filters
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // ---------- Helpers ----------
  const formatDistance = (km) => {
    if (unit === "mi") return `${(km * 0.621371).toFixed(1)} mi`;
    return `${km.toFixed(1)} km`;
  };

  const sliderMax = unit === "km" ? 500 : Math.round(200 * 0.621371);

  // ---------- Effects ----------
  // load complementary matches on mount + whenever slider changes
  useEffect(() => {
    if (!user) return;
    const distanceKm =
      unit === "mi" ? Math.round(distanceRange / 0.621371) : distanceRange;

    dispatch(
      fetchMatches({
        lat: user.lat,
        lng: user.lng,
        distanceKm,
        minScore: 80,
        tags: selectedTags,
      })
    );
  }, [dispatch, user, distanceRange, unit, selectedTags]);

  // fetch all available tags once
  useEffect(() => {
    async function loadTags() {
      try {
        const res = await apiClient("/api/tags");
        setAvailableTags(res || []);
      } catch (err) {
        console.error("Failed to load tags:", err);
      }
    }
    loadTags();
  }, []);

  // fetch suggestions as user types
  useEffect(() => {
    if (!skill.trim()) {
      setSuggestions([]);
      setDropdownOpen(false);
      return;
    }
    let active = true;
    async function fetchTags(query) {
      try {
        const res = await apiClient(`/api/tags?q=${encodeURIComponent(query)}`);
        if (active) {
          setSuggestions(res || []);
          setDropdownOpen(true);
        }
      } catch (err) {
        console.error("Failed to fetch tag suggestions:", err);
        if (active) setSuggestions([]);
      }
    }
    const delay = setTimeout(() => fetchTags(skill), 300); // debounce
    return () => {
      active = false;
      clearTimeout(delay);
    };
  }, [skill]);

  // ---------- Handlers ----------
  const handleSelectTag = async (tagName) => {
    setSkill(tagName);
    setDropdownOpen(false);

    setSkillLoading(true);
    try {
      const result = await dispatch(
        searchMatches({ tag: tagName, distanceKm: distanceRange })
      ).unwrap();
      setSkillResults(result);
    } catch (err) {
      console.error("Skill search failed:", err);
      setSkillResults([]);
    } finally {
      setSkillLoading(false);
    }
  };

  const toggleFilter = (tag) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(next);
  };

  const handleAddFriend = (id) => {
    dispatch(sendRequest(id));
  };

  const handleMessage = async (peerId) => {
    try {
      const res = await dispatch(startThread(peerId)).unwrap();
      navigate("/messages");
    } catch (e) {
      console.error("Failed to start conversation:", e);
      alert("Could not start a conversation. Please try again.");
    }
  };

  // ---------- Derived matches (sorted) ----------
  const sortedMatches = useMemo(() => {
    if (!matches) return [];
    const copy = [...matches];
    if (sortBy === "distance") {
      return copy.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else {
      return copy.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }
  }, [matches, sortBy]);

  // ---------- Render ----------
  return (
    <div className="p-6 space-y-8 h-full flex flex-col">
      {/* ---------- Controls ---------- */}
      <div className="flex items-center justify-between mb-4">
        {/* Distance toggle + slider */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Distance:</span>
          <button
            onClick={() => setUnit("km")}
            className={`px-2 py-1 rounded text-sm ${
              unit === "km" ? "bg-brand-600 text-white" : "bg-neutral-700"
            }`}
          >
            KM
          </button>
          <button
            onClick={() => setUnit("mi")}
            className={`px-2 py-1 rounded text-sm ${
              unit === "mi" ? "bg-brand-600 text-white" : "bg-neutral-700"
            }`}
          >
            MI
          </button>

          <input
            type="range"
            min="1"
            max={sliderMax}
            value={distanceRange}
            onChange={(e) => setDistanceRange(Number(e.target.value))}
            className="w-40"
          />
          <span className="text-gray-300 text-sm">
            {distanceRange} {unit}
          </span>
        </div>

        {/* Sort dropdown */}
        <div>
          <label className="text-gray-400 text-sm mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-neutral-800 text-white text-sm rounded p-1 border border-neutral-600"
          >
            <option value="score">Match Score</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>

      {/* ---------- Matches Section ---------- */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">
          Your Skill Matches
        </h2>

        {/* Filters */}
        <details className="mb-4">
          <summary className="cursor-pointer text-sm text-gray-400 mb-2">
            Filter by skill
          </summary>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTags.map((t) => (
              <label
                key={t.id}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  selectedTags.includes(t.name)
                    ? "bg-brand-600 text-white"
                    : "bg-neutral-700 text-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  value={t.name}
                  checked={selectedTags.includes(t.name)}
                  onChange={() => toggleFilter(t.name)}
                  className="hidden"
                />
                {t.name
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
            ))}
          </div>
        </details>

        {loading && <p className="text-gray-400">Loading matches...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && sortedMatches.length === 0 && (
          <p className="text-gray-400">No matches found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMatches.map((m) => {
            const isFriend = friends.some((f) => f.id === m.id);

            return (
              <UserCard
                key={m.id}
                id={m.id}
                name={m.name}
                avatar={m.avatar || Crest}
                useful={m.usefulForMe || []}
                useless={m.usefulForThem || []}
                matchScore={m.matchScore}
                variant="match"
                extraInfo={
                  m.distanceKm != null ? (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Ruler size={12} className="text-brand-500" />
                      {formatDistance(m.distanceKm)} away
                    </div>
                  ) : null
                }
                actions={[
                  !isFriend && (
                    <button
                      key="friend"
                      onClick={() => handleAddFriend(m.id)}
                      className="p-1 bg-brand-600 hover:bg-brand-500 rounded-full"
                      title="Add Friend"
                    >
                      <UserPlus size={18} className="text-white" />
                    </button>
                  ),
                  <button
                    key="msg"
                    onClick={() => handleMessage(m.id)}
                    className="p-1 bg-gray-600 hover:bg-gray-500 rounded-full"
                    title="Message"
                  >
                    <MessageCircle size={18} className="text-white" />
                  </button>,
                ].filter(Boolean)} // 🔹 remove null if already a friend
              />
            );
          })}
        </div>
      </div>

      {/* ---------- Search by Skill ---------- */}
      <div className="h-1/2 bg-neutral-900 rounded-lg p-4 shadow-md overflow-y-auto relative">
        <h3 className="text-lg font-bold text-white mb-3">Search by Skill</h3>

        <div className="relative mb-4">
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Start typing a skill (e.g. plumbing, gardening)"
            className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          {dropdownOpen && suggestions.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg max-h-40 overflow-y-auto shadow-lg">
              {suggestions.map((t) => (
                <li
                  key={t.id}
                  onClick={() => handleSelectTag(t.name)}
                  className="px-3 py-2 cursor-pointer hover:bg-neutral-700 text-white"
                >
                  {t.name
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </li>
              ))}
            </ul>
          )}
        </div>

        {skillLoading && <p className="text-gray-400">Searching…</p>}

        {!skillLoading && skillResults.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-2">
              Found {skillResults.length} users skilled in{" "}
              <span className="font-semibold">{skill}</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillResults.map((u) => (
                <UserCard
                  key={u.id}
                  id={u.id}
                  name={u.name}
                  avatar={u.avatar || Crest}
                  useful={[skill]}
                  variant="match"
                  extraInfo={
                    u.distanceKm != null ? (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Ruler size={12} className="text-brand-500" />
                        {formatDistance(u.distanceKm)} away
                      </div>
                    ) : null
                  }
                />
              ))}
            </div>
          </div>
        )}

        {!skillLoading && skillResults.length === 0 && skill && (
          <p className="text-gray-400">No users found for skill "{skill}".</p>
        )}
      </div>
    </div>
  );
}
