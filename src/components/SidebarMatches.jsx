import { Link } from "react-router-dom";
import UserCard from "./UserCard";

const placeholder =
  "https://managingbarca.com/wp-content/uploads/2025/06/Pep-Guardiola.jpg";

export default function SidebarMatches() {
  // For now using placeholder matches
  const matches = [
    { id: 1, name: "Tom", useful: "DIY", useless: "Tech" },
    { id: 2, name: "Ben", useful: "Cooking", useless: "DIY" },
  ];

  return (
    <div className="bg-neutral-800 rounded-2xl shadow-md p-4 space-y-3">
      <h2 className="text-lg font-bold">Skill Matches</h2>

      <div className="grid grid-cols-1 gap-2">
        {matches.map((m) => (
          <UserCard
            key={m.id}
            name={m.name}
            useful={m.useful}
            useless={m.useless}
            placeholder={placeholder}
            className="min-h-[140px] text-sm"
          />
        ))}
      </div>

      <Link
        to="/matches"
        className="block text-sm text-brand-400 hover:underline mt-2"
      >
        See all matches →
      </Link>
    </div>
  );
}
