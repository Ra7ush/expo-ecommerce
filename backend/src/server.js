import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(clerkMiddleware());
app.use(express.json());

// Inngest webhook endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

//make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    app.use(
      res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
    );
  });
}

const startServer = async () => {
  await connectDB();
  console.log("Connected to database");
  app.listen(ENV.PORT, () => {
    console.log(`Server is running on http://localhost:${ENV.PORT}`);
  });
};

startServer();
