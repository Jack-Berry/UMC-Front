// src/components/NewsCard.jsx
import { useState } from "react";
import { X } from "lucide-react";

export default function NewsCard({
  title,
  type,
  url,
  summary,
  content,
  image_url,
  created_at,
  pinned,
  actions, // optional React nodes (admin buttons, etc.)
}) {
  const [showModal, setShowModal] = useState(false);

  const hasLongContent =
    (summary && summary.length > 200) || (content && content.length > 300);

  return (
    <>
      <div className="bg-slate-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col md:flex-row">
        {/* Image side (if exists) */}
        {image_url && (
          <div className="md:w-1/3">
            <img
              src={image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Content side */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-semibold mb-2 text-blue-400 hover:underline">
            {type === "external" && url ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            ) : (
              title
            )}
          </h3>

          {summary && (
            <p
              className={`text-gray-300 text-sm mb-2 whitespace-pre-line ${
                hasLongContent ? "line-clamp-3" : ""
              }`}
            >
              {summary}
            </p>
          )}
          {type === "native" && content && (
            <p
              className={`text-gray-300 text-sm mb-2 whitespace-pre-line ${
                hasLongContent ? "line-clamp-5" : ""
              }`}
            >
              {content}
            </p>
          )}

          {/* Read more → opens modal */}
          {hasLongContent && (
            <button
              onClick={() => setShowModal(true)}
              className="self-start text-xs text-blue-400 hover:text-blue-300 mt-1"
            >
              Read more
            </button>
          )}

          {/* Meta + optional actions */}
          <div className="mt-auto flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-slate-700">
            <span>
              Posted on {new Date(created_at).toLocaleDateString()}
              {pinned && (
                <span className="ml-2 bg-yellow-600 text-white px-2 py-0.5 rounded text-xs">
                  📌 Pinned
                </span>
              )}
            </span>
            {actions && <div className="flex gap-3">{actions}</div>}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {image_url && (
              <img
                src={image_url}
                alt=""
                className="w-full object-cover max-h-72 rounded-t-xl"
              />
            )}

            <div className="p-6">
              <h2 className="text-xl font-bold mb-3 text-blue-400">{title}</h2>

              {summary && (
                <p className="text-gray-300 text-sm mb-4 whitespace-pre-line">
                  {summary}
                </p>
              )}
              {type === "native" && content && (
                <p className="text-gray-300 text-sm whitespace-pre-line">
                  {content}
                </p>
              )}

              <div className="mt-6 text-xs text-gray-400">
                Posted on {new Date(created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
