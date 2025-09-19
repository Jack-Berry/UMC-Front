// src/components/Feed.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNews } from "../redux/newsSlice";
import { Link } from "react-router-dom";

export default function Feed() {
  const dispatch = useDispatch();
  const { list: news, loading } = useSelector((s) => s.news);

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Latest News</h2>

      {loading ? (
        <p className="text-gray-400">Loading news...</p>
      ) : news.length ? (
        <ul className="space-y-6">
          {news.map((post) => (
            <li
              key={post.id}
              className="bg-slate-800 rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">
                {post.type === "external" ? (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {post.title}
                  </a>
                ) : (
                  post.title
                )}
              </h3>

              {/* Summary or Content */}
              {post.summary && (
                <p className="text-gray-300 mt-2 text-sm">{post.summary}</p>
              )}
              {post.type === "native" && post.content && (
                <p className="text-gray-300 mt-2 text-sm">{post.content}</p>
              )}

              {/* Image */}
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt=""
                  className="mt-3 rounded max-h-48 object-cover"
                />
              )}

              {/* Meta */}
              <div className="text-xs text-gray-500 mt-3">
                Posted on {new Date(post.created_at).toLocaleDateString()}
                {post.pinned && (
                  <span className="ml-2 bg-yellow-600 text-white px-2 py-0.5 rounded text-xs">
                    📌 Pinned
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No news yet.</p>
      )}
    </div>
  );
}
