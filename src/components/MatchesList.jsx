// src/components/MatchesList.jsx
import UserCard from "./UserCard";

const placeholder =
  "https://managingbarca.com/wp-content/uploads/2025/06/Pep-Guardiola.jpg";

const matches = [
  { id: 1, name: "Tom", useful: "DIY", useless: "Tech" },
  { id: 2, name: "Ben", useful: "Cooking", useless: "DIY" },
  { id: 3, name: "Chris", useful: "Tech", useless: "Communication" },
];

export default function MatchesList() {
  return (
    <div className="bg-neutral-800 p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold">Skill Swap Matches</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((m) => (
          <UserCard
            key={m.id}
            name={m.name}
            useful={m.useful}
            useless={m.useless}
            placeholder={placeholder}
            className="min-h-[220px]" // a touch taller for pills
          />
        ))}
      </div>
    </div>
  );
}
