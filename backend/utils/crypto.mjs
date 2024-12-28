import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, "salt", 32);
const iv = crypto.randomBytes(16);

export const encrypt = (text) => {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
        iv: iv.toString("hex"),
        content: encrypted,
    };
};

export const decrypt = (hash) => {
    let decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(hash.iv, "hex")
    );
    let decrypted = decipher.update(hash.content, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};
