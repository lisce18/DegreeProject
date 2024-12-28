import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    amount: { type: String, required: true },
    state: {
        type: String,
        enum: [
            "CREATED",
            "ACCEPTED",
            "DEPOSITED",
            "COMPLETED",
            "DISPUTED",
            "CANCELED",
            "REFUNDED",
        ],
        required: true,
    },
    deliveryDate: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
