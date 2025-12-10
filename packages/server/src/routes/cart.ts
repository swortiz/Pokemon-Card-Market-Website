import { Router } from "express";
import auth from "../middleware/auth.js";     
import { CredentialModel } from "../services/credential-svc.js";


const router = Router();

// GET /cart - Load user's cart
router.get("/", auth, async (req: any, res) => {
  const username = req.user.username;

  const user = await CredentialModel.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ cart: user.cart || [] });
});

// POST /cart - Save user's cart
router.post("/", auth, async (req: any, res) => {
  const username = req.user.username;
  const { cart } = req.body;

  const user = await CredentialModel.findOneAndUpdate(
    { username },
    { cart },
    { new: true }
  );

  res.json({ cart: user?.cart });
});

export default router;
