import User from "../models/User.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (username, password) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { userId: user._id, companyId: user.company },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        return { token };
    } catch (err) {
        throw new Error(err.message);
    }
};
