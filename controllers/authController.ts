import dotenv from "dotenv";
import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

dotenv.config();

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  console.error(
    "No JWT_SECRET environment variable has been defined in .env"
  );
  process.exit(1);
}

// Function that creates a new User and adds it to the DB
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if username exists in the database
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Check if password is of minimum length
    if (password.length < 8) {
      return res.status(400).json({ message: "Minimum length of password needs to be 8 characters." });
    }

    let role = "user";
    // Create a new user
    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Function that authenticates the given credentials and authorizes using a JWT to be used in future API calls
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if username exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Creates and returns a JWT that expires in 1 hour
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    let redirect = "/home";

    // Set redirect if user has not filled out personal details
    if(!user.personalDetails){
      redirect = "/personal";
    }

    // Set redirect if user has not filled out user details
    if(!user.userDetails){
      redirect = "/user";
    }

    res.status(200).json({ token, redirect });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
