import { app } from "../server/server.js";
import { connectDB } from "../server/lib/db.js";

export default async function handler(req, res) {
  // Ensure database is connected before processing request
  await connectDB();
  return app(req, res);
}
