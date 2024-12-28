import express from "express";
import { login } from "../controllers/authController.mjs";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const { token } = await login(username, password);
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
