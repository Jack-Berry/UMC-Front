// src/components/AddFriendModal.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchUsers,
  sendRequest,
  selectSearchResults,
} from "../redux/friendsSlice";

export default function AddFriendModal({ open, onClose }) {
  const dispatch = useDispatch();
  const searchResults = useSelector(selectSearchResults);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");

  if (!open) return null;

  const handleSearch = (e) => {
    e.preventDefault();

    // only send fields that are non-empty
    const params = {};
    if (email.trim()) params.email = email.trim();
    if (firstName.trim()) params.first_name = firstName.trim();
    if (lastName.trim()) params.last_name = lastName.trim();
    if (displayName.trim()) params.display_name = displayName.trim();

    if (Object.keys(params).length === 0) return; // nothing to search

    dispatch(searchUsers(params));
  };

  const handleSendRequest = (id) => {
    dispatch(sendRequest(id));
    setEmail("");
    setFirstName("");
    setLastName("");
    setDisplayName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-neutral-800 p-6 rounded-lg w-96 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Add a Friend</h2>

        <form onSubmit={handleSearch} className="space-y-3">
          <input
            type="email"
            placeholder="Search by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-neutral-700 text-white"
          />
          <input
            type="text"
            placeholder="Search by first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 rounded bg-neutral-700 text-white"
          />
          <input
            type="text"
            placeholder="Search by last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 rounded bg-neutral-700 text-white"
          />
          <input
            type="text"
            placeholder="Search by display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
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
        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center bg-neutral-700 p-2 rounded"
              >
                <span>
                  {user.display_name ||
                    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                    user.email}
                  {user.distance && (
                    <span className="ml-2 text-xs text-gray-400">
                      {(user.distance / 1000).toFixed(1)} km away
                    </span>
                  )}
                </span>
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
