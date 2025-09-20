import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchUsersByEmail,
  sendRequest,
  selectSearchResults,
} from "../redux/friendsSlice";

export default function AddFriendModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const searchResults = useSelector(selectSearchResults);

  if (!open) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    dispatch(searchUsersByEmail(email));
  };

  const handleSendRequest = (id) => {
    dispatch(sendRequest(id));
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-neutral-800 p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Add a Friend</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="email"
            placeholder="Enter friend's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-neutral-700 text-white"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 rounded bg-brand-600 hover:bg-brand-500 text-white"
          >
            Search
          </button>
        </form>

        {/* Results */}
        <div className="mt-4 space-y-2">
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center bg-neutral-700 p-2 rounded"
              >
                <span>{user.name || user.email}</span>
                <button
                  onClick={() => handleSendRequest(user.id)}
                  className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 text-sm text-white"
                >
                  Add
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No results yet.</p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
