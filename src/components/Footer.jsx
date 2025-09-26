// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 p-6 text-sm">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-base font-semibold text-white">
            Useless Men’s Co-Operative
          </h2>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} UMC. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <nav className="flex gap-6">
          <Link
            to="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-use"
            className="hover:text-white transition-colors"
          >
            Terms of Use
          </Link>
          <Link
            to="/safeguarding-policy"
            className="hover:text-white transition-colors"
          >
            Safeguarding Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
