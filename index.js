import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;
const PORT = process.env.PORT || 3000;
import albumsRoute from "./routes/albumsRoute.js";
import musiciansRoute from "./routes/musiciansRoute.js";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/albums", albumsRoute);
app.use("/musicians", musiciansRoute);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to Mongo successfully");
    app.listen(PORT, () => {
      console.log(`Server listening at port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));

export default app;
