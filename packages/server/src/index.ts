import PkmCards from "./services/pkm-card-svc";
import express, { Request, Response } from "express";
import cards from "./routes/pkm-cards";
import auth, { authenticateUser } from "./routes/auth";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
const uri = process.env.MONGO_URI ?? process.env.MONGODB_URI;

app.use(express.static(staticDir));
app.use(express.json());

// CORS configuration - MOVED HERE, BEFORE ROUTES
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes - AFTER CORS
app.use("/auth", auth);
app.use("/api/cards", authenticateUser, cards);

app.get("/cards/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  PkmCards.get(id).then((data) => {
    if (data)
      res
        .set("Content-Type", "application/json")
        .send(JSON.stringify(data));
    else
      res.status(404).send();
  });
});

app.get("/cards", async (req: Request, res: Response) => {
  const allCards = await PkmCards.index();
  res.set("Content-Type", "application/json").send(JSON.stringify(allCards));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

if (!uri) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}

console.log("Connecting to MongoDB at", uri.replace(/:\/\/.*@/, "://***:***@"));

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log(" Connected to MongoDB Atlas"))
  .catch(err => console.error(" MongoDB connection error:", err));