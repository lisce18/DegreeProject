import express from "express";
import { resolveDispute } from "../controllers/contractController.mjs";

const router = express.Router();

router.post("/resolveDispute", async (req, res) => {
    try {
        const { transactionId, releaseFundsToPartyB } = req.body;
        const transactionHash = await resolveDispute(
            transactionId,
            releaseFundsToPartyB
        );
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/transaction:id", async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await getTransaction(transactionId);
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
