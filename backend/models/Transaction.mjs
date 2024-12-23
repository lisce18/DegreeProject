import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    buyer: { type: String, required: true },
    seller: { type: String, required: true },
    amount: { type: String, required: true },
    state: { type: String, required: true },
    deliveryDate: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
