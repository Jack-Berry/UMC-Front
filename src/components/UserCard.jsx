// src/components/UserCard.jsx
import Crest from "../assets/Crest.png";

// 🔹 Helper: format skill slugs into human-readable text
function displaySkill(skill) {
  if (!skill) return "";
  return skill
    .replace(/-/g, " ") // kebab-case → spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalise words
}

export default function UserCard({
  id,
  name,
  display_name,
  first_name,
  last_name,
  avatar,
  useful = [],
  useless = [],
  matchScore,
  placeholder = Crest,
  variant = "friend", // "friend" | "match"
  extraInfo, // 🔹 optional info (distance, etc.)
  actions, // 🔹 React node(s) for action icons
  online, // 🔹 presence flag (boolean)
}) {
  // Normalised display name
  const resolvedName =
    name || display_name || first_name || last_name || `User ${id}`;

  return (
    <div className="relative bg-neutral-800 hover:bg-neutral-700 rounded-lg p-4 flex flex-col items-center text-center shadow-md transition">
      {/* 🔹 Top-right actions */}
      {actions && (
        <div className="absolute top-2 right-2 flex gap-2">{actions}</div>
      )}

      {/* Avatar with presence marker */}
      <div className="relative mb-3">
        <img
          src={avatar || placeholder}
          alt={resolvedName}
          className="w-16 h-16 rounded-full object-cover border border-neutral-600"
        />
        {online !== undefined && (
          <span
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-neutral-800 ${
              online ? "bg-green-500" : "bg-gray-500"
            }`}
            title={online ? "Online" : "Offline"}
          />
        )}
      </div>

      <h3 className="text-lg font-semibold text-white mb-1">{resolvedName}</h3>

      {/* Only show in matches */}
      {variant === "match" && matchScore !== undefined && (
        <p className="text-sm text-gray-400">Match score: {matchScore}</p>
      )}

      {/* Distance or extra info */}
      {extraInfo && <div className="mt-1">{extraInfo}</div>}

      {variant === "match" && (
        <div className="space-y-3 w-full mt-3">
          {/* Useful skills */}
          {useful.length > 0 && (
            <div>
              <p className="text-xs font-medium text-green-400 mb-1">
                They can help you with:
              </p>
              <div className="flex flex-wrap gap-1 justify-center max-h-20 overflow-y-auto">
                {useful.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-full bg-green-600/20 text-green-300"
                  >
                    {displaySkill(s)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Useless (your strengths for them) */}
          {useless.length > 0 && (
            <div>
              <p className="text-xs font-medium text-blue-400 mb-1">
                You can help them with:
              </p>
              <div className="flex flex-wrap gap-1 justify-center max-h-20 overflow-y-auto">
                {useless.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-full bg-blue-600/20 text-blue-300"
                  >
                    {displaySkill(s)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
