import express from "express";
import {
    cancelOrder,
    confirmCompletion,
    createTransaction,
    deposit,
    getTransaction,
    raiseDispute,
} from "../controllers/contractController.mjs";

const router = express.Router();

router.get("/getTransaction/:id", async (req, res) => {
    try {
        const transaction = await getTransaction(req.params.id);
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/createTransaction", async (req, res) => {
    try {
        const { partyB } = req.body;
        const transactionId = await createTransaction(partyB);
        res.json({ transactionId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/deposit", async (req, res) => {
    try {
        const { transactionId, amount } = req.body;
        const transactionHash = await deposit(transactionId, amount);
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/confirmCompletion", async (req, res) => {
    try {
        const { transactionId } = req.body;
        const transactionHash = await confirmCompletion(transactionId);
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/raiseDispute", async (req, res) => {
    try {
        const { transactionId } = req.body;
        const transactionHash = await raiseDispute(transactionId);
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/cancelOrder", async (req, res) => {
    try {
        const { transactionId } = req.body;
        const transactionHash = await cancelOrder(transactionId);
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
