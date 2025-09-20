import React from "react";

export default function SafeguardingPolicy() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-200">
      <h1 className="text-3xl font-bold mb-2 text-white">
        Safeguarding Policy
      </h1>
      <p className="text-sm text-gray-400 border-b border-gray-700 pb-4 mb-8">
        Last updated: {today}
      </p>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">Purpose</h2>
      <p>
        UMC is committed to providing a safe and supportive environment for all
        users.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">Scope</h2>
      <p>This policy applies to:</p>
      <ul className="list-disc ml-6 space-y-1">
        <li>Online messaging and interactions.</li>
        <li>Events created through the app.</li>
        <li>Admins and moderators.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">Principles</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Respect: all members treated with dignity.</li>
        <li>Zero tolerance: harassment, abuse, or discrimination.</li>
        <li>Duty of care: respond promptly to reports of harm.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">Reporting</h2>
      <p>
        Users can report inappropriate content via the app. Reports are reviewed
        by admins within 48 hours. Serious concerns may be escalated to
        authorities.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">Events</h2>
      <p>
        Organisers must enforce a code of conduct. Attendees should report
        concerns immediately to organisers or via the app.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-blue-400">Enforcement</h2>
      <p>
        Warnings, suspensions, or bans may be applied. Illegal activity will be
        reported to relevant authorities.
      </p>
    </div>
  );
}
