try {
  const app = require("../server/app");
  
  // Export Express app for Vercel serverless functions
  // Vercel automatically handles Express apps
  module.exports = app;
} catch (error) {
  console.error("Error loading Express app:", error);
  console.error("Error stack:", error.stack);
  console.error("Current directory:", __dirname);
  console.error("Trying to require:", require.resolve("../server/app"));
  
  module.exports = (req, res) => {
    console.error("Express app failed to load - details in server logs");
    res.status(500).json({ 
      error: "Server configuration error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  };
}

