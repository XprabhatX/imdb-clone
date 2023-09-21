import dotenv from "dotenv";
import express from "express";
import dbConnect from "./dbConnect.js";
import movieRoutes from "./routes/movies.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', movieRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {console.log(`🌎 ✔ listening on port ${port}`)});

dbConnect();