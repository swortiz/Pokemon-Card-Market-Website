import express, { Request, Response } from "express";
import { PkmCard } from "../models/pkm-card";
import PkmCards from "../services/pkm-card-svc";

const router = express.Router();

// GET all
router.get("/", (_, res: Response) => {
  PkmCards.index()
    .then((list: PkmCard[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET one by id
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  PkmCards.get(id)
    .then((card: PkmCard) => res.json(card))
    .catch((err) => res.status(404).send(err));
});
// POST (Create)
router.post("/", (req: Request, res: Response) => {
  const newCard = req.body;
  PkmCards.create(newCard)
    .then((card: PkmCard) => res.status(201).json(card))
    .catch((err) => res.status(500).send(err));
});

// PUT (Update)
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const newCard = req.body;
  PkmCards.update(id, newCard)
    .then((card: PkmCard) => res.json(card))
    .catch((err) => res.status(404).send(err));
});

// DELETE
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  PkmCards.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;

