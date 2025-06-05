// middleware/auth.js
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const appKey = req.headers['x-app-key'];

  if (apiKey !== process.env.API_KEY || appKey !== process.env.APP_KEY) {
    return res.status(403).json({ error: "Invalid API/App keys" });
  }
  next(); // Proceed if keys match
};

module.exports = apiKeyAuth;