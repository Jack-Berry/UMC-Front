const diyAssessment = [
  {
    category: "DIY & Repairs",
    description:
      "Deep dive into your practical skills across home, garden, plumbing, cars and tools.",
    questions: [
      {
        id: "diy-1",
        text: "What level are you at with everyday gardening tasks (planting, mowing, pruning)?",
        followUps: {
          minScore: 4,
          questions: [
            {
              id: "diy-1a",
              text: "Can you design and maintain a flower bed or vegetable patch?",
            },
            {
              id: "diy-1b",
              text: "Do you know how to use powered garden tools (hedge trimmer, strimmer)?",
            },
            {
              id: "diy-1c",
              text: "Can you build or repair garden structures (fence, shed, decking)?",
            },
            {
              id: "diy-1d",
              text: "Can you install irrigation or drainage systems for a garden?",
            },
            {
              id: "diy-1e",
              text: "Do you know how to graft or propagate plants successfully?",
            },
          ],
        },
      },
      {
        id: "diy-2",
        text: "What level are you at with interior improvements (painting, flooring, tiling)?",
        followUps: {
          minScore: 4,
          questions: [
            {
              id: "diy-2a",
              text: "Can you safely fit shelving units or cupboards?",
            },
            {
              id: "diy-2b",
              text: "Can you install or repair flooring (tiles, laminate, carpet)?",
            },
            {
              id: "diy-2c",
              text: "Have you ever completed a room renovation project (kitchen, bathroom, loft)?",
            },
            {
              id: "diy-2d",
              text: "Can you carry out basic plastering or wall repairs?",
            },
            {
              id: "diy-2e",
              text: "Can you safely remove and replace internal walls or partitions?",
            },
          ],
        },
      },
      {
        id: "diy-3",
        text: "What level are you at with simple plumbing (fixing leaks, changing taps)?",
        followUps: {
          minScore: 4,
          questions: [
            { id: "diy-3a", text: "Can you install or replace a toilet?" },
            { id: "diy-3b", text: "Can you fit or repair a shower or bath?" },
            {
              id: "diy-3c",
              text: "Do you understand basic water pipe layouts (supply vs waste)?",
            },
            {
              id: "diy-3d",
              text: "Can you install or replace radiators or a heating system component?",
            },
            {
              id: "diy-3e",
              text: "Can you solder or join copper piping confidently?",
            },
          ],
        },
      },
      {
        id: "diy-4",
        text: "What level are you at with car maintenance (oil changes, tyres, battery)?",
        followUps: {
          minScore: 4,
          questions: [
            { id: "diy-4a", text: "Can you replace brake pads or discs?" },
            {
              id: "diy-4b",
              text: "Can you change a timing belt or alternator?",
            },
            {
              id: "diy-4c",
              text: "Do you understand how to diagnose engine warning lights?",
            },
            {
              id: "diy-4d",
              text: "Can you service a car fully (oil, filters, spark plugs, coolant, brakes)?",
            },
            { id: "diy-4e", text: "Can you replace a clutch or gearbox?" },
          ],
        },
      },
      {
        id: "diy-5",
        text: "What level are you at with common power tools (drill, saw, sander)?",
        followUps: {
          minScore: 4,
          questions: [
            {
              id: "diy-5a",
              text: "Can you safely operate and maintain a circular saw or jigsaw?",
            },
            {
              id: "diy-5b",
              text: "Have you built furniture or structures using power tools?",
            },
            {
              id: "diy-5c",
              text: "Do you understand workshop safety (PPE, ventilation, electrics)?",
            },
            {
              id: "diy-5d",
              text: "Can you build fitted furniture (wardrobes, cabinets, or a workbench)?",
            },
            {
              id: "diy-5e",
              text: "Can you use advanced tools (router, table saw, lathe) with confidence?",
            },
          ],
        },
      },
      {
        id: "diy-6",
        text: "Do you own a set of basic tools (e.g., screwdriver set, hammer, pliers)?",
        followUps: {
          minScore: 4,
          questions: [
            {
              id: "diy-6a",
              text: "Can you sharpen and maintain tools like chisels, saws, or blades?",
            },
            {
              id: "diy-6b",
              text: "Do you know how to properly oil/grease and store tools to extend their lifespan?",
            },
            {
              id: "diy-6c",
              text: "Can you identify and select the correct tool for a job without guidance?",
            },
            {
              id: "diy-6d",
              text: "Do you use safety gear (PPE, eye protection, gloves) consistently when working?",
            },
            {
              id: "diy-6e",
              text: "Can you measure and mark accurately using tools like spirit levels, squares, or calipers?",
            },
          ],
        },
      },
    ],
  },
];

export default diyAssessment;
