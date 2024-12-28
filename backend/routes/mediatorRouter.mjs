import express from "express";
import {
    getTransaction,
    resolveDispute,
} from "../controllers/contractController.mjs";
import { createCompany } from "../controllers/companyController.mjs";

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

router.get("/transaction/:transactionId", async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await getTransaction(transactionId);
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/createCompany", async (req, res) => {
    try {
        const {
            name,
            adminUsername,
            adminPassword,
            walletAddress,
            privateKey,
        } = req.body;

        const { company, admin } = await createCompany(
            name,
            adminUsername,
            adminPassword,
            walletAddress,
            privateKey
        );
        res.json({ company, admin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
