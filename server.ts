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

const PORT = process.env.PORT;

// Limit requests to official front end URL
var corsOptions = {
  origin: "https://binfotech-angular-681fa36d1e62.herokuapp.com",
};

// Connect to MongoDB cluster
connectToDatabase(ATLAS_URI)
  .then(() => {
    const app: Express = express();
    app.use(cors(corsOptions));

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
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  })
  .catch((error) => console.error(error));