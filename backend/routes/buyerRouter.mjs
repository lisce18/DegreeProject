import express from "express";
import {
    cancelOrder,
    confirmCompletion,
    createTransaction,
    deposit,
    getTransaction,
    raiseDispute,
} from "../controllers/contractController.mjs";
import { authenticate, authorizeBuyer } from "../middleware/auth.mjs";

export const router = express.Router();

router.get("/transaction/:transactionId", async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await getTransaction(transactionId);
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post(
    "/createTransaction",
    authenticate,
    authorizeBuyer,
    async (req, res) => {
        try {
            const { sellerAddress } = req.body;
            const buyerCompanyId = req.companyId;
            const result = await createTransaction(
                buyerCompanyId,
                sellerAddress
            );
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.post("/deposit", authenticate, authorizeBuyer, async (req, res) => {
    try {
        const { transactionId, amount } = req.body;
        const buyerCompanyId = req.companyId;
        const transactionHash = await deposit(
            buyerCompanyId,
            transactionId,
            amount
        );
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post(
    "/confirmCompletion",
    authenticate,
    authorizeBuyer,
    async (req, res) => {
        try {
            const { transactionId } = req.body;
            const buyerCompanyId = req.companyId;
            const transactionHash = await confirmCompletion(
                buyerCompanyId,
                transactionId
            );
            res.json({ transactionHash });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.post("/raiseDispute", authenticate, authorizeBuyer, async (req, res) => {
    try {
        const { transactionId } = req.body;
        const buyerCompanyId = req.companyId;
        const transactionHash = await raiseDispute(
            buyerCompanyId,
            transactionId
        );
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/cancelOrder", authenticate, async (req, res) => {
    try {
        const { transactionId } = req.body;
        const buyerCompanyId = req.companyId;
        const transactionHash = await cancelOrder(
            buyerCompanyId,
            transactionId
        );
        res.json({ transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
