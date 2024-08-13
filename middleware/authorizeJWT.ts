const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  console.error(
    "No JWT_SECRET environment variable has been defined in .env"
  );
  process.exit(1);
}

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

// Verify access token in header
function verifyToken(req: Request, res: Response, next: NextFunction) {
  let token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res
      .status(403)
      .send({ message: "No token was found in the headers." });
  jwt.verify(token, JWT_SECRET, (error: Error, decoded: JwtPayload) => {
    if (error) return res.status(403).send({ error: "Access token was denied." });
    req.userId = decoded.id;
    next();
  });
}

module.exports = {
  verifyToken: verifyToken,
};
