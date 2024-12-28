import express from "express";
import { addUser } from "../controllers/companyController.mjs";
import { authenticate, authorizeAdmin } from "../middleware/auth.mjs";

const router = express.Router();

router.post("/addUser", authenticate, authorizeAdmin, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const companyId = req.companyId;
        const newUser = await addUser(companyId, username, password, role);
        res.json(newUser);
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
