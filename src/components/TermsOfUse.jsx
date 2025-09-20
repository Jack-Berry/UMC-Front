import React from "react";

export default function TermsOfUse() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-200">
      <h1 className="text-3xl font-bold mb-2 text-white">Terms of Use</h1>
      <p className="text-sm text-gray-400 border-b border-gray-700 pb-4 mb-8">
        Last updated: {today}
      </p>

      <ol className="list-decimal ml-6 space-y-6">
        <li>
          <span className="text-blue-400 font-semibold">Eligibility</span> — You
          must be 18 or older to use UMC.
        </li>
        <li>
          <span className="text-blue-400 font-semibold">Acceptable Use</span> —
          No harassment, abuse, or illegal content. No explicit or harmful
          material. Respect event organisers and attendees.
        </li>
        <li>
          <span className="text-blue-400 font-semibold">Messaging</span> —
          Messaging is text-only for community use. No media or file
          attachments. UMC may access encrypted logs if required by law.
        </li>
        <li>
          <span className="text-blue-400 font-semibold">Events</span> — You
          attend events at your own risk. UMC is not responsible for injury,
          loss, or damages. Organisers must follow our safeguarding policy.
        </li>
        <li>
          <span className="text-blue-400 font-semibold">Accounts</span> — Keep
          your login secure. You are responsible for account activity. UMC may
          suspend or delete accounts that breach these terms.
        </li>
        <li>
          <span className="text-blue-400 font-semibold">Liability</span> — UMC
          provides the service “as is” without warranties. Our liability is
          limited to the maximum permitted by law.
        </li>
        <li>
          <span className="text-blue-400 font-semibold">Changes</span> — We may
          update these Terms. Continued use of the app means acceptance of the
          new terms.
        </li>
      </ol>
    </div>
  );
}
