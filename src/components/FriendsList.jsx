// src/components/FriendsList.jsx
import UserCard from "./UserCard";

const placeholder =
  "https://managingbarca.com/wp-content/uploads/2025/06/Pep-Guardiola.jpg";

const friends = [
  { id: 1, name: "Dave", online: true },
  { id: 2, name: "Sam", online: false },
  { id: 3, name: "Alex", online: true },
];

export default function FriendsList() {
  return (
    <div className="bg-neutral-800 p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold">Friends</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((f) => (
          <UserCard
            key={f.id}
            name={f.name}
            online={f.online}
            placeholder={placeholder}
          />
        ))}
      </div>

      <button className="mt-2 bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded text-white font-medium">
        Add Friend
      </button>
    </div>
  );
}
