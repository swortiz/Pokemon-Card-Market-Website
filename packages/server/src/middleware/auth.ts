import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { Request, Response, NextFunction } from "express";

dotenv.config(); 

const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET"; 


export default function auth(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET) as any;
    req.user = decoded;  
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
