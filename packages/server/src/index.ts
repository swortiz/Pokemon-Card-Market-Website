// add this import near the top
import { connect } from "./services/mongo";
import PkmCards from "./services/pkm-card-svc";
connect("Pokemon");
import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

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
