// src/pages/Register.jsx
import { useState, useEffect, useRef } from "react";
import { registerUser } from "../api/auth";
import { checkDisplayName } from "../api/users"; // ✅ live availability check
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Validation helpers
import {
  validateName,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validateDob,
} from "../utils/validation";

// Policy components
import TermsOfUse from "../components/TermsOfUse";
import PrivacyPolicy from "../components/PrivacyPolicy";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    password: "",
    dob: "",
    accepted_terms: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Display name live check states
  const [checkingDisplayName, setCheckingDisplayName] = useState(false);
  const [displayNameAvailable, setDisplayNameAvailable] = useState(null);
  const debounceRef = useRef(null);

  // Modal states
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const navigate = useNavigate();

  // ------------------ validation ------------------
  const validateForm = () => {
    const newErrors = {};

    newErrors.first_name = validateName("First name", form.first_name);
    newErrors.last_name = validateName("Last name", form.last_name);
    newErrors.display_name = validateDisplayName(form.display_name);
    newErrors.email = validateEmail(form.email);
    newErrors.password = validatePassword(form.password);
    newErrors.dob = validateDob(form.dob);

    if (displayNameAvailable === false) {
      newErrors.display_name = "Display name already taken.";
    }

    if (!form.accepted_terms) {
      newErrors.accepted_terms =
        "You must accept the terms and privacy policy.";
    }

    // Remove nulls
    Object.keys(newErrors).forEach(
      (key) => newErrors[key] === null && delete newErrors[key]
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------ live display name check ------------------
  const runDisplayNameCheck = async (name) => {
    if (!name || !name.trim()) {
      setDisplayNameAvailable(null);
      return;
    }
    setCheckingDisplayName(true);
    try {
      const res = await checkDisplayName(name.trim());
      setDisplayNameAvailable(res.available);
      if (!res.available) {
        setErrors((prev) => ({
          ...prev,
          display_name: "Display name already taken.",
        }));
      }
    } catch (err) {
      console.error("Check display name failed:", err);
    } finally {
      setCheckingDisplayName(false);
    }
  };

  useEffect(() => {
    if (!form.display_name) {
      setDisplayNameAvailable(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runDisplayNameCheck(form.display_name);
    }, 2500);
    return () => clearTimeout(debounceRef.current);
  }, [form.display_name]);

  const handleDisplayNameBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    runDisplayNameCheck(form.display_name);
  };

  // ------------------ form handling ------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await registerUser(form);
      setSuccess(true);
    } catch (err) {
      alert(err.message || "Registration failed. Please try again.");
    }
  };

  // ------------------ success screen ------------------
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white px-4">
        <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Registration Successful</h2>
          <p className="mb-6">
            Please check your email and click the verification link to activate
            your account.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-500 rounded text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ------------------ form UI ------------------
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="min-h-screen flex items-center justify-center bg-neutral-900 px-4"
      >
        <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create Account
          </h2>

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <input
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.first_name && (
                <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <input
                name="last_name"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.last_name && (
                <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>

            {/* Display Name */}
            <div>
              <input
                name="display_name"
                placeholder="Display Name"
                value={form.display_name}
                onChange={handleChange}
                onBlur={handleDisplayNameBlur}
                className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {checkingDisplayName && (
                <p className="text-gray-400 text-sm mt-1">
                  Checking availability…
                </p>
              )}
              {displayNameAvailable === true && (
                <p className="text-green-400 text-sm mt-1">
                  Display name is available ✓
                </p>
              )}
              {displayNameAvailable === false && (
                <p className="text-red-400 text-sm mt-1">
                  Display name already taken ✗
                </p>
              )}
              {errors.display_name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.display_name}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <DatePicker
                selected={form.dob ? new Date(form.dob) : null}
                onChange={(date) =>
                  setForm((prev) => ({
                    ...prev,
                    dob: date ? date.toISOString().split("T")[0] : "",
                  }))
                }
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                dateFormat="dd/MM/yyyy"
                placeholderText="Date of Birth"
                maxDate={new Date()}
                className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.dob && (
                <p className="text-red-400 text-sm mt-1">{errors.dob}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                name="accepted_terms"
                checked={form.accepted_terms}
                onChange={handleChange}
                className="h-4 w-4 mt-1 rounded border-gray-600 bg-neutral-700 focus:ring-brand-500"
              />
              <span>
                I accept the{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-brand-400 hover:underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="text-brand-400 hover:underline"
                >
                  Privacy Policy
                </button>
                .
              </span>
            </label>
            {errors.accepted_terms && (
              <p className="text-red-400 text-sm mt-1">
                {errors.accepted_terms}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-2 bg-brand-600 hover:bg-brand-500 transition rounded text-white font-semibold"
          >
            Register
          </button>

          <p className="mt-4 text-sm text-center text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-brand-400 hover:underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        </div>
      </form>

      {/* Terms Modal */}
      {showTerms && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="bg-neutral-800 p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <TermsOfUse />
            <button
              onClick={() => setShowTerms(false)}
              className="mt-6 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowPrivacy(false)}
        >
          <div
            className="bg-neutral-800 p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <PrivacyPolicy />
            <button
              onClick={() => setShowPrivacy(false)}
              className="mt-6 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
