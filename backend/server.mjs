import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import buyerRouter from "./routes/buyerRouter.mjs";
import sellerRouter from "./routes/sellerRouter.mjs";
import mediatorRouter from "./routes/mediatorRouter.mjs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connted to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB: ", error.message);
    });

app.use("/api/v1/buyer", buyerRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/mediator", mediatorRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
