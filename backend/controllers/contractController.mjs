import { ethers } from "ethers";
import dotenv from "dotenv";
import { readFile } from "fs/promises";
import { jsonBigIntSerializer } from "../utils/jsonBigIntSerializer.mjs";

dotenv.config();

const rpcUrl = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const contractABI = JSON.parse(
    await readFile(new URL("../Escrow.json", import.meta.url))
);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

export const createTransaction = async (partyB) => {
    try {
        const tx = await contract.createTransaction(partyB);
        const receipt = await tx.wait();

        console.log("Transaction receipt:", JSON.stringify(receipt, null, 2));

        const iface = new ethers.Interface(contractABI);

        console.log("Receipt logs:", JSON.stringify(receipt.logs, null, 2));

        for (const log of receipt.logs) {
            console.log("Log:", log);
            try {
                const parsedLog = iface.parseLog(log);
                console.log("Parsed log:", parsedLog);
                if (parsedLog.name === "TransactionCreated") {
                    const transactionId =
                        parsedLog.args.transactionId.toString();
                    return { transactionId };
                }
            } catch (e) {
                console.error("Error parsing log:", e);
            }
        }

        console.error("Logs:", JSON.stringify(receipt.logs, null, 2));
        throw new Error("TransactionCreated event not found in logs");
    } catch (error) {
        console.error("Error creating transaction:", error);
        return { error: error.message };
    }
};

export const getTransaction = async (transactionId) => {
    const transaction = await contract.getTransaction(BigInt(transactionId));
    return JSON.parse(JSON.stringify(transaction, jsonBigIntSerializer));
};

export const deposit = async (transactionId, amount) => {
    const tx = await contract.deposit(transactionId, {
        value: ethers.utils.parseEther(amount),
    });
    await tx.wait();
    return tx.hash;
};

export const confirmCompletion = async (transactionId) => {
    const tx = await contract.confirmCompletion(BigInt(transactionId));
    await tx.wait();
    return tx.hash;
};

export const raiseDispute = async (transactionId) => {
    const tx = await contract.raiseDispute(transactionId);
    await tx.wait();
    return tx.hash;
};

export const resolveDispute = async (transactionId, releaseFundsToPartyB) => {
    const tx = await contract.resolveDispute(
        transactionId,
        releaseFundsToPartyB
    );
    await tx.wait();
    return tx.hash;
};

export const cancelOrder = async (transactionId) => {
    const tx = await contract.cancelOrder(transactionId);
    await tx.wait();
    return tx.hash;
};
