import React from "react";

export default function PrivacyPolicy() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-200">
      <h1 className="text-3xl font-bold mb-2 text-white">Privacy Policy</h1>
      <p className="text-sm text-gray-400 border-b border-gray-700 pb-4 mb-8">
        Last updated: {today}
      </p>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">Who we are</h2>
      <p>
        Useless Men’s Co-Operative (“UMC”, “we”, “our”) is a community app
        helping men identify personal growth areas and connect with others.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">
        What data we collect
      </h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Account details: name, email, password (hashed).</li>
        <li>Profile information: bio, skills, avatar.</li>
        <li>Assessment results: your answers and scores.</li>
        <li>Messages: text messages sent via the app.</li>
        <li>Events: attendance records and event details.</li>
        <li>Technical data: logs, cookies, device/browser info.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">
        How we use your data
      </h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>To provide and improve the app.</li>
        <li>To match users and recommend events.</li>
        <li>To moderate and enforce community guidelines.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">
        Third-party services
      </h2>
      <p>
        We use the Google Places API for location autocomplete. Google may
        collect location queries. Our hosting is provided by Gandi.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">
        Data storage &amp; security
      </h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Messages and personal data are encrypted on our servers.</li>
        <li>Passwords are securely hashed.</li>
        <li>Access is restricted to authorised admins.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">
        How long we keep your data
      </h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Account/profile data: until you delete your account.</li>
        <li>Messages: until deleted by you, or for [X months] (TBC).</li>
        <li>Events: for 12 months after the event.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">Your rights</h2>
      <p>
        You can request access, correction, deletion (“right to be forgotten”),
        and data portability. Contact us at{" "}
        <span className="font-mono">[UMC support email]</span>.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">
        ICO Registration
      </h2>
      <p>We are registered with the Information Commissioner’s Office (ICO).</p>
    </div>
  );
}
