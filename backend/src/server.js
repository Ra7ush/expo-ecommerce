import express from "express";
import path from "path";
import ENV from "./config/env.js";

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

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

app.listen(ENV.PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
