import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNews, addNews, editNews, removeNews } from "../../redux/newsSlice";
import { PlusCircle, Pencil, Trash2, Link as LinkIcon } from "lucide-react";
import NewsModal from "../../components/NewsModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import NewsCard from "../../components/NewsCard";

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
        <LoadingSpinner text="Loading news..." />
      ) : news.length ? (
        <ul className="space-y-4">
          {news.map((post) => (
            <li key={post.id}>
              <NewsCard
                {...post}
                actions={
                  <>
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
                  </>
                }
              />
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
