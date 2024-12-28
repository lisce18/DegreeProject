import express from "express";
import {
    acceptTransaction,
    cancelOrder,
    getTransaction,
} from "../controllers/contractController.mjs";
import { authenticate, authorizeSeller } from "../middleware/auth.mjs";

const router = express.Router();

router.post("/cancelOrder", authenticate, async (req, res) => {
    try {
        const { transactionId } = req.body;
        const companyId = req.companyId;
        const transactionHash = await cancelOrder(companyId, transactionId);
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/acceptOrder", authenticate, authorizeSeller, async (req, res) => {
    try {
        const { transactionId, deliveryDate } = req.body;
        const companyId = req.companyId;

        const isoDeliveryDate = new Date(deliveryDate).toISOString();

        const transactionHash = await acceptTransaction(
            companyId,
            transactionId,
            isoDeliveryDate
        );
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/transaction/:transactionId", async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await getTransaction(transactionId);
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
