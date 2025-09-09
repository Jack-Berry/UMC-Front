// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#7d8ca3", // slate gray with a blue hue
          500: "#56667a", // cool mid-gray
          600: "#394452", // deep gunmetal
        },
      },
    },
  },
  plugins: [],
};

// brand: {
//           400: "#669bbc", // light steel blue
//           500: "#407ba7", // medium steel
//           600: "#265c89", // deep steel/navy
//         },

// brand: {
//           400: "#7fbf7f", // soft green
//           500: "#4c9a4c", // strong forest green
//           600: "#2e7031", // deep green
//         },

// brand: {
//   400: "#c57b7b",
//   500: "#9a3d3d",
//   600: "#701f1f",
// },
