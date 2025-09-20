// src/components/LoadingSpinner.jsx
import Crest from "../assets/Crest Transparent.png";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <img src={Crest} alt="Loading" className="w-24 h-24 animate-pulse-grow" />
      <p className="mt-3 text-gray-300 text-sm">{text}</p>
    </div>
  );
}
