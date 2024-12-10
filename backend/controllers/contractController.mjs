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

        const iface = new ethers.Interface(contractABI);

        const log = receipt.logs.find((log) => {
            try {
                const parsedLog = iface.parseLog(log);
                return parsedLog.name === "TransactionCreated";
            } catch (e) {
                return false;
            }
        });

        const parsedLog = iface.parseLog(log);
        const transactionId = parsedLog.args.transactionId.toString();
        return { transactionId };
    } catch (error) {
        return { error: error.message };
    }
};

export const getTransaction = async (transactionId) => {
    const transaction = await contract.getTransaction(BigInt(transactionId));
    return JSON.parse(JSON.stringify(transaction, jsonBigIntSerializer));
};

export const deposit = async (transactionId, amount) => {
    const tx = await contract.deposit(transactionId, {
        value: ethers.parseEther(amount),
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
