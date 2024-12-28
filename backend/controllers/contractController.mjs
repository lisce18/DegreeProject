import { ethers } from "ethers";
import dotenv from "dotenv";
import { readFile } from "fs/promises";
import Transaction from "../models/Transaction.mjs";
import Company from "../models/Company.mjs";
import { decrypt } from "../utils/crypto.mjs";

dotenv.config();

const rpcUrl = process.env.RPC_URL;
const mediatorPrivateKey = process.env.MEDIATOR_PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(rpcUrl);
const contractABI = JSON.parse(
    await readFile(new URL("../Escrow.json", import.meta.url))
);

const mediatorWallet = new ethers.Wallet(mediatorPrivateKey, provider);
const mediatorContract = new ethers.Contract(
    contractAddress,
    contractABI,
    mediatorWallet
);

export const getCompanyWallet = async (companyId) => {
    const company = await Company.findById(companyId);
    if (!company) {
        throw new Error("Company not found!");
    }
    const decryptedPrivateKey = decrypt(
        JSON.parse(company.encryptedPrivateKey)
    );
    return new ethers.Wallet(decryptedPrivateKey, provider);
};

export const createTransaction = async (buyerCompanyId, sellerAddress) => {
    try {
        const buyerCompany = await Company.findById(buyerCompanyId);
        const sellerCompany = await Company.findOne({
            walletAddress: sellerAddress,
        });

        if (!buyerCompany || !sellerCompany) {
            throw new Error("One or both companies not found.");
        }

        const buyerWallet = await getCompanyWallet(buyerCompanyId);
        const buyerContract = new ethers.Contract(
            contractAddress,
            contractABI,
            buyerWallet
        );
        const tx = await buyerContract.createTransaction(sellerAddress);
        const receipt = await tx.wait();

        const iface = new ethers.Interface(contractABI);

        const log = receipt.logs.find((log) => {
            try {
                const parsedLog = iface.parseLog(log);
                return parsedLog.name === "TransactionCreated";
            } catch (e) {
                console.error("Error parsing log:", e);
                return false;
            }
        });

        if (!log) {
            throw new Error("TransactionCreated event not found in logs");
        }

        const parsedLog = iface.parseLog(log);
        const transactionId = parsedLog.args.transactionId.toString();

        const newTransaction = new Transaction({
            transactionId,
            buyer: buyerCompany._id,
            seller: sellerCompany._id,
            amount: "0",
            state: "CREATED",
        });

        await newTransaction.save();

        return { transactionId };
    } catch (error) {
        return { error: error.message };
    }
};

export const getTransaction = async (transactionId) => {
    const transaction = await Transaction.findOne({
        transactionId,
    })
        .populate("buyer", "name walletAddress")
        .populate("seller", "name walletAddress")
        .select("transactionId buyer seller amount state deliveryDate");

    if (!transaction) {
        throw new Error("Transaction not found.");
    }

    const result = {
        transactionId: transaction.transactionId,
        buyer: {
            name: transaction.buyer.name,
            walletAddress: transaction.buyer.walletAddress,
        },
        seller: {
            name: transaction.seller.name,
            walletAddress: transaction.seller.walletAddress,
        },
        amount: transaction.amount,
        state: transaction.state,
        deliveryDate: transaction.deliveryDate,
    };

    return result;
};

export const acceptTransaction = async (
    companyId,
    transactionId,
    deliveryDate
) => {
    try {
        const buyerWallet = await getCompanyWallet(companyId);
        const buyerContract = new ethers.Contract(
            contractAddress,
            contractABI,
            buyerWallet
        );

        const tx = await buyerContract.acceptTransaction(transactionId);
        await tx.wait();

        await Transaction.updateOne(
            { transactionId },
            { state: "ACCEPTED", deliveryDate }
        );

        return tx.hash;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const deposit = async (companyId, transactionId, amount) => {
    try {
        const buyerWallet = await getCompanyWallet(companyId);
        const buyerContract = new ethers.Contract(
            contractAddress,
            contractABI,
            buyerWallet
        );
        const tx = await buyerContract.deposit(transactionId, {
            value: ethers.parseEther(amount),
        });
        await tx.wait();

        await Transaction.updateOne(
            { transactionId },
            { amount, state: "DEPOSITED" }
        );

        return tx.hash;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const confirmCompletion = async (companyId, transactionId) => {
    try {
        const buyerWallet = await getCompanyWallet(companyId);
        const buyerContract = new ethers.Contract(
            contractAddress,
            contractABI,
            buyerWallet
        );
        const tx = await buyerContract.confirmCompletion(BigInt(transactionId));
        await tx.wait();

        await Transaction.updateOne({ transactionId }, { state: "COMPLETED" });

        return tx.hash;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const raiseDispute = async (companyId, transactionId) => {
    try {
        const buyerWallet = await getCompanyWallet(companyId);
        const buyerContract = new ethers.Contract(
            contractAddress,
            contractABI,
            buyerWallet
        );
        const tx = await buyerContract.raiseDispute(transactionId);
        await tx.wait();

        await Transaction.updateOne({ transactionId }, { state: "DISPUTED" });

        return tx.hash;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const resolveDispute = async (transactionId, releaseFundsToPartyB) => {
    try {
        const tx = await mediatorContract.resolveDispute(
            transactionId,
            releaseFundsToPartyB
        );
        await tx.wait();

        if (releaseFundsToPartyB !== true) {
            await Transaction.updateOne(
                { transactionId },
                { state: "REFUNDED" }
            );
        } else {
            await Transaction.updateOne(
                { transactionId },
                { state: "COMPLETED" }
            );
        }

        return tx.hash;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const cancelOrder = async (companyId, transactionId) => {
    try {
        const transaction = await Transaction.findOne({
            transactionId,
        }).populate("buyer seller");
        if (!transaction) {
            throw new Error("Transaction not found!");
        }

        const companyIdStr = companyId.toString();
        const buyerIdStr = transaction.buyer._id.toString();
        const sellerIdStr = transaction.seller._id.toString();

        if (buyerIdStr !== companyIdStr && sellerIdStr !== companyIdStr) {
            throw new Error("Only a buyer or seller can cancel an order!");
        }

        const wallet = await getCompanyWallet(companyId);
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            wallet
        );

        const tx = await contract.cancelOrder(transactionId);
        await tx.wait();

        await Transaction.updateOne({ transactionId }, { state: "CANCELLED" });

        return tx.hash;
    } catch (err) {
        throw new Error(err.message);
    }
};
