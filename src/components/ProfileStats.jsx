export default function ProfileStats({ score }) {
  return (
    <div className="bg-neutral-800 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
      <p className="text-sm text-gray-400 mb-2">
        Based on your initial assessment
      </p>
      <div className="w-full bg-neutral-700 rounded h-4 overflow-hidden">
        <div
          className="bg-brand-500 h-full"
          style={{ width: `${(score || 0) * 20}%` }}
        />
      </div>
      <p className="text-sm mt-1">
        Current score: <span className="font-bold">{score ?? "N/A"}/5</span>
      </p>
    </div>
  );
}
