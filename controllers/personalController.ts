import { Request, Response } from "express";
import User from "../models/user";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

// Function that creates new Personal Details and adds it to the user
export const personal = async (req: Request, res: Response) => {
  try {
    const { occupation, hobbies, visited, artist, musician } = req.body;
    await User.findByIdAndUpdate(req.userId, { personalDetails: { occupation, hobbies, visited, artist, musician } });
    res.status(200).json({ message: "Successfully updated personal details for user." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};