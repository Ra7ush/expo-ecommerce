import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js";
import orderRouter from "./routes/order.route.js";
import reviewRouter from "./routes/review.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import cors from "cors";

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(clerkMiddleware());
app.use(express.json());
app.use(
  cors({
    origin: ENV.CLIENT_URL, // Adjust this to your frontend's origin
    credentials: true, // Allow the browser to send cookies to the server with requests
  })
); //CORS (Cross-Origin Resource Sharing) in Express.js is a mechanism that
// allows a server to explicitly permit web browsers to access its resources from a different origin

// Inngest webhook endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

//make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });
}

const startServer = async () => {
  await connectDB();
  console.log("Connected to database");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
