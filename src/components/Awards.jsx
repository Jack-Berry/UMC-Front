export default function Awards() {
  return (
    <div className="bg-neutral-800 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Awards</h2>
      <p className="text-gray-400 text-sm mb-2">
        Unlock awards by completing more assessments
      </p>
      <div className="grid grid-cols-3 gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="border border-neutral-700 p-4 rounded text-center text-gray-500"
            >
              🔒 Locked
            </div>
          ))}
      </div>
    </div>
  );
}
