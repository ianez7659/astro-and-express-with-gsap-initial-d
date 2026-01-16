try {
  const app = require("../server/app");
  
  // Export Express app for Vercel serverless functions
  // Vercel automatically handles Express apps
  module.exports = app;
} catch (error) {
  console.error("Error loading Express app:", error);
  module.exports = (req, res) => {
    console.error("Express app failed to load");
    res.status(500).json({ error: "Server configuration error" });
  };
}

