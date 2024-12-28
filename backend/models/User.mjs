import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    role: {
        type: String,
        enum: ["buyer", "seller", "admin", "mediator"],
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
