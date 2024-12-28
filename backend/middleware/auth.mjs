import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

export const authenticate = async (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).populate("company");

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.companyId = user.company._id;
        next();
    } catch (error) {
        res.status(401).json({ error: "Please authenticate." });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};

export const authorizeBuyer = (req, res, next) => {
    if (req.user.role !== "buyer") {
        return res.status(403).json({ error: "Access denied. Buyers only." });
    }
    next();
};

export const authorizeSeller = (req, res, next) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({ error: "Access denied. Sellers only." });
    }
    next();
};
