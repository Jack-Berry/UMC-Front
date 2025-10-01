// src/components/Feed.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNews } from "../redux/newsSlice";
import LoadingSpinner from "./LoadingSpinner";
import NewsCard from "./NewsCard";

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
        <LoadingSpinner text="Loading news..." />
      ) : news.length ? (
        <ul className="space-y-6">
          {news.map((post) => (
            <li key={post.id}>
              <NewsCard {...post} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No news yet.</p>
      )}
    </div>
  );
}
