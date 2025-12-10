import PkmCards from "./services/pkm-card-svc";
import express, { Request, Response } from "express";
import cards from "./routes/pkm-cards";
import auth, { authenticateUser } from "./routes/auth";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
const uri = process.env.MONGO_URI ?? process.env.MONGODB_URI;

app.use(express.json());



//Cors
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//Routes
app.use("/auth", auth);
app.use("/api/cards", authenticateUser, cards);

app.get("/auth/test-db", async (req, res) => {
  try {
    const connection = mongoose.connection;

    if (connection.readyState !== 1) {
      return res.status(500).json({
        ok: false,
        message: "MongoDB is NOT connected",
        readyState: connection.readyState
      });
    }
    const db = connection.db;
    if (!db) {
      return res.status(500).json({
        ok: false,
        message: "Connected to Mongo server, but NO DATABASE selected.",
        hint: "Does your MONGO_URI end with a database name?",
        uriExample: "mongodb+srv://so27:Stevenmax04@cluster/pokemon-market"
      });
    }
    const collections = await connection.db.listCollections().toArray();

    res.json({
      ok: true,
      message: "MongoDB is connected",
      collections: collections.map(c => c.name)
    });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

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

app.get("/api/pkmcards", async (req: Request, res: Response) => {
  const allCards = await PkmCards.index();
  res.json(allCards);
});

app.get("/api/pkmcards/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const card = await PkmCards.get(id);
  if (card) res.json(card);
  else res.status(404).send();
});
app.use(express.static(staticDir));

app.use("/app", (req, res) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, "utf8").then((html) => res.send(html));
});

app.get("/auth/db-info", (req, res) => {
  const conn = mongoose.connection;
  res.json({
    host: conn.host,
    name: conn.name,        // <-- DATABASE NAME
    collections: Object.keys(conn.collections),
    readyState: conn.readyState
  });
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