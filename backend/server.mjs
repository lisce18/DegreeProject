import express from "express";
import dotenv from "dotenv";
import buyerRouter from "./routes/buyerRouter.mjs";
import sellerRouter from "./routes/sellerRouter.mjs";
import mediatorRouter from "./routes/mediatorRouter.mjs";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/v1/buyer", buyerRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/mediator", mediatorRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
