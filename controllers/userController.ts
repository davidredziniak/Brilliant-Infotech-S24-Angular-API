import { Request, Response } from "express";
import User from "../models/user";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

// Function that creates new User Details and adds it to the user
export const user = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phoneNumber, addressOne, addressTwo, city, state, zip, country } = req.body;
    await User.findByIdAndUpdate(req.userId, { userDetails: { firstName, lastName, email, phoneNumber, addressOne, addressTwo, city, state, zip, country } });
    res.status(200).json({ message: "Successfully updated details for user." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if(user){
      res.status(200).json({ username: user.username, userDetails: user.userDetails, personalDetails: user.personalDetails });
    } else {
      res.status(400).json({ error: "Error finding user details. "});
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}