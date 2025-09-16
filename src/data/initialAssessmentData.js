// /src/data/assessmentData.js

const assessmentData = [
  {
    category: "DIY & Repairs",
    description:
      "Assess your confidence and experience with fixing and maintaining things around the home.",
    questions: [
      {
        id: "diy-1",
        text: "How confident are you using basic tools like a hammer or screwdriver?",
      },
      {
        id: "diy-2",
        text: "Can you assemble flat-pack furniture without help?",
      },
      {
        id: "diy-3",
        text: "Have you ever repaired something in your home (e.g., a leaking tap, squeaky hinge)?",
      },
      {
        id: "diy-4",
        text: "Can you hang a shelf or picture securely on a wall?",
      },
    ],
  },
  {
    category: "Technology",
    description:
      "Gauge your ability to set up and troubleshoot modern technology.",
    questions: [
      {
        id: "tech-1",
        text: "How confident are you setting up new devices (TV, Wi-Fi, smart home tech)?",
      },
      {
        id: "tech-2",
        text: "Do you know how to keep your computer or phone software up to date?",
      },
      {
        id: "tech-3",
        text: "Can you confidently troubleshoot basic tech issues?",
      },
      {
        id: "tech-4",
        text: "Are you comfortable using tools like spreadsheets or word processors?",
      },
    ],
  },
  {
    category: "Well-being & Self-care",
    description:
      "Check how well you take care of your physical and mental health.",
    questions: [
      {
        id: "well-1",
        text: "Do you have a regular exercise or movement routine?",
      },
      {
        id: "well-2",
        text: "Do you take time to reflect on your mental well-being?",
      },
      { id: "well-3", text: "Can you confidently prepare a healthy meal?" },
      { id: "well-4", text: "Do you make time for rest and recovery?" },
    ],
  },
  {
    category: "Communication & Relationships",
    description: "Reflect on how well you connect and communicate with others.",
    questions: [
      {
        id: "comm-1",
        text: "How confident are you at expressing your needs in relationships?",
      },
      {
        id: "comm-2",
        text: "Are you comfortable giving and receiving feedback?",
      },
      {
        id: "comm-3",
        text: "Do you find it easy to have difficult conversations without conflict?",
      },
      {
        id: "comm-4",
        text: "Can you maintain long-term friendships or close connections?",
      },
    ],
  },
  {
    category: "Community & Contribution",
    description:
      "Evaluate your sense of responsibility to others and your community.",
    questions: [
      {
        id: "commu-1",
        text: "Are you involved in any community or volunteering activities?",
      },
      {
        id: "commu-2",
        text: "Do you feel a sense of responsibility toward others?",
      },
      {
        id: "commu-3",
        text: "Have you ever supported someone else in learning or improving a skill?",
      },
      {
        id: "commu-4",
        text: "Do you make time to contribute beyond your own household?",
      },
    ],
  },
];

export default assessmentData;
