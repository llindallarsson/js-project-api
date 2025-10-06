import listEndpoints from "express-list-endpoints";

import app from "./app.js";

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Thoughts API: http://localhost:${PORT}/thoughts`);
  console.log(`👤 Users API: http://localhost:${PORT}/users`);

  console.log("\n📋 All API Endpoints:");
  console.log(listEndpoints(app));
});
