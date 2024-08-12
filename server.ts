import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
const routes = require('./routes');

// Load environment variables from the .env file
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in .env"
  );
  process.exit(1);
}


// Connect to MongoDB cluster
connectToDatabase(ATLAS_URI)
  .then(() => {
    const app: Express = express();
    app.use(cors());

    // Parse requests of application/json
    app.use(express.json());

    // Parse requests of application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // Define routes
    app.use('/api', routes);
    app.get("/", (req: Request, res: Response) => {
        res.send("Express + TypeScript Server");
    });
      
    // Start the Express server
    app.listen(3000, () => {
      console.log(`Server running at http://localhost:3000...`);
    });
  })
  .catch((error) => console.error(error));