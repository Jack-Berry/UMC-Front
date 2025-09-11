// src/components/Feed.jsx
const dummyPosts = [
  {
    id: 1,
    author: "Dave",
    content: "Just fixed my leaky tap! Feeling like a DIY king 🛠️",
    timestamp: "2h ago",
  },
  {
    id: 2,
    author: "Sam",
    content: "Booked onto the community BBQ this weekend 🍔🔥",
    timestamp: "5h ago",
  },
  {
    id: 3,
    author: "Alex",
    content: "Anyone want to skill-swap tech help for gardening tips? 🌱💻",
    timestamp: "1d ago",
  },
];

export default function Feed() {
  return (
    <div className="bg-neutral-800 mt-10 p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-bold">Community Feed</h2>
      {dummyPosts.map((post) => (
        <div
          key={post.id}
          className="bg-gray-700 p-4 rounded-md hover:bg-gray-600 transition"
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span className="font-semibold text-white">{post.author}</span>
            <span>{post.timestamp}</span>
          </div>
          <p className="text-gray-200">{post.content}</p>
        </div>
      ))}
    </div>
  );
}
