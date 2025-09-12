// src/data/technologyAssessment.js

const technologyAssessment = [
  {
    category: "Technology & Digital Skills",
    description:
      "Deep dive into your digital confidence across computers, phones, internet, and security.",
    questions: [
      {
        id: "tech-1",
        text: "How comfortable are you with using email, browsing, and managing files?",
        followUps: {
          minScore: 4,
          questions: [
            {
              id: "tech-1a",
              text: "Can you install and configure new software safely?",
            },
            {
              id: "tech-1b",
              text: "Do you know how to back up files to the cloud or external drives?",
            },
            {
              id: "tech-1c",
              text: "Can you troubleshoot common issues like a slow computer or error messages?",
            },
            {
              id: "tech-1d",
              text: "Can you confidently set up a new computer from scratch (updates, accounts, software)?",
            },
          ],
        },
      },
      {
        id: "tech-2",
        text: "How confident are you with setting up and using a smartphone?",
        followUps: {
          minScore: 4,
          questions: [
            {
              id: "tech-2a",
              text: "Can you move data/photos from one phone to another?",
            },
            {
              id: "tech-2b",
              text: "Do you know how to manage storage and clear space?",
            },
            {
              id: "tech-2c",
              text: "Can you set up parental controls or accessibility features?",
            },
            {
              id: "tech-2d",
              text: "Do you update apps and the operating system regularly?",
            },
          ],
        },
      },
      {
        id: "tech-3",
        text: "How confident are you with word processing, spreadsheets, and presentations?",
        followUps: {
          minScore: 4,
          questions: [
            {
              id: "tech-3a",
              text: "Can you use formulas and charts in spreadsheets?",
            },
            {
              id: "tech-3b",
              text: "Do you know how to collaborate on shared documents online?",
            },
            {
              id: "tech-3c",
              text: "Can you make a professional-looking presentation?",
            },
            {
              id: "tech-3d",
              text: "Do you know how to merge documents or export to PDF?",
            },
            {
              id: "tech-3e",
              text: "Can you use templates or basic automation to save time?",
            },
          ],
        },
      },
      {
        id: "tech-4",
        text: "How confident are you using the internet safely and effectively?",
        followUps: {
          minScore: 4,
          questions: [
            {
              id: "tech-4a",
              text: "Do you know how to shop online safely?",
            },
            {
              id: "tech-4b",
              text: "Can you spot suspicious websites or scams?",
            },
            {
              id: "tech-4c",
              text: "Do you use social media with privacy settings enabled?",
            },
            {
              id: "tech-4d",
              text: "Do you know how to manage cookies and browser settings?",
            },
            {
              id: "tech-4e",
              text: "Can you set up online banking or government digital services?",
            },
          ],
        },
      },
      {
        id: "tech-5",
        text: "How confident are you with setting up and managing home internet?",
        followUps: {
          minScore: 4,
          questions: [
            {
              id: "tech-5a",
              text: "Can you set up or reset a Wi-Fi router?",
            },
            {
              id: "tech-5b",
              text: "Do you know how to connect devices like printers or smart TVs?",
            },
            {
              id: "tech-5c",
              text: "Can you fix Wi-Fi problems such as weak signal or devices not connecting?",
            },
            {
              id: "tech-5d",
              text: "Do you know how to make your Wi-Fi secure with a strong password?",
            },
            {
              id: "tech-5e",
              text: "Can you set up a guest network for visitors?",
            },
          ],
        },
      },
      {
        id: "tech-6",
        text: "How confident are you in keeping your accounts and data safe?",
        followUps: {
          minScore: 4,
          questions: [
            {
              id: "tech-6a",
              text: "Do you use strong and unique passwords?",
            },
            {
              id: "tech-6b",
              text: "Do you know how to use two-factor authentication?",
            },
            {
              id: "tech-6c",
              text: "Can you recognise phishing emails or scam texts?",
            },
            {
              id: "tech-6d",
              text: "Do you update devices and software regularly for security?",
            },
            {
              id: "tech-6e",
              text: "Do you know how to safely dispose of an old phone or laptop?",
            },
          ],
        },
      },
    ],
  },
];

export default technologyAssessment;
