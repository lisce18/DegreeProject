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

        // Log the received privateKey
        console.log("Private key received:", privateKey);

        // Encrypt the private key
        const encryptedPrivateKey = encrypt(privateKey);

        // Create a new company
        const newCompany = new Company({
            name,
            walletAddress,
            encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
        });

        await newCompany.save();

        // Hash the admin password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create a new admin user
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

        // Hash the user password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            company: companyId,
            role,
        });

        await newUser.save();

        // Add the new user to the company's user array
        company.users.push(newUser._id);
        await company.save(); // Save the company document

        return newUser;
    } catch (err) {
        throw new Error(err.message);
    }
};
