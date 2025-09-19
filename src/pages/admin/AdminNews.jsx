import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNews, addNews, editNews, removeNews } from "../../redux/newsSlice";
import { PlusCircle, Pencil, Trash2, Link as LinkIcon } from "lucide-react";
import NewsModal from "../../components/NewsModal";

export default function AdminNews() {
  const dispatch = useDispatch();
  const news = useSelector((s) => s.news.list) || [];
  const loading = useSelector((s) => s.news.loading);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this news post?")) return;
    dispatch(removeNews(id));
  };

  const handleSubmit = async (formData) => {
    if (editing) {
      await dispatch(editNews({ id: editing.id, data: formData }));
    } else {
      await dispatch(addNews(formData));
    }
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div className="p-5 bg-neutral-900 text-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage News</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded text-white font-semibold flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Create Post
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading news...</p>
      ) : news.length ? (
        <ul className="space-y-4">
          {news.map((post) => (
            <li key={post.id} className="bg-slate-800 rounded-lg p-4 space-y-3">
              {/* Title */}
              <h3 className="font-semibold text-xl">{post.title}</h3>

              {/* External link */}
              {post.type === "external" && post.url && (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 text-sm"
                >
                  <LinkIcon size={14} /> {post.url}
                </a>
              )}

              {/* Image */}
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt=""
                  className="w-full max-h-64 object-cover rounded"
                />
              )}

              {/* Body text */}
              {post.type === "native" && post.content && (
                <p className="text-gray-200 text-base whitespace-pre-line">
                  {post.content}
                </p>
              )}

              {post.type === "external" && post.summary && (
                <p className="text-gray-300 text-sm">{post.summary}</p>
              )}

              {/* Footer with actions */}
              <div className="flex justify-end gap-4 border-t border-slate-700 pt-3">
                <button
                  onClick={() => {
                    setEditing(post);
                    setShowModal(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No news yet.</p>
      )}

      <NewsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        initialData={editing}
      />
    </div>
  );
}
