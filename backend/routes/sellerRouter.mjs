import express from "express";
import {
    cancelOrder,
    confirmCompletion,
    createTransaction,
    deposit,
    getTransaction,
    raiseDispute,
    resolveDispute,
} from "../controllers/contractController.mjs";

const router = express.Router();

router.post("/cancelOrder", async (req, res) => {
    try {
        const { transactionId } = req.body;
        const transactionHash = await cancelOrder(transactionId);
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/getTransaction/:id", async (req, res) => {
    try {
        const transaction = await getTransaction(req.params.id);
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
