import Company from "../models/Company.mjs";
import User from "../models/User.mjs";
import { encrypt } from "../utils/crypto.mjs";
import bcrypt from "bcryptjs";

export const createCompany = async (
    name,
    adminUsername,
    adminPassword,
    walletAddress,
    privateKey
) => {
    try {
        if (!privateKey) {
            throw new Error("Private key is required");
        }

        const encryptedPrivateKey = encrypt(privateKey);

        const newCompany = new Company({
            name,
            walletAddress,
            encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
        });

        await newCompany.save();

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const newAdmin = new User({
            username: adminUsername,
            password: hashedPassword,
            company: newCompany._id,
            role: "admin",
        });

        await newAdmin.save();

        newCompany.users.push(newAdmin._id);
        await newCompany.save();

        return { company: newCompany, admin: newAdmin };
    } catch (err) {
        throw new Error(err.message);
    }
};

export const addUser = async (companyId, username, password, role) => {
    try {
        const company = await Company.findById(companyId);
        if (!company) {
            throw new Error("Company not found!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            company: companyId,
            role,
        });

        await newUser.save();

        company.users.push(newUser._id);
        await company.save();

        return newUser;
    } catch (err) {
        throw new Error(err.message);
    }
};
