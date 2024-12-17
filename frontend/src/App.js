import React, { useState, useEffect } from "react";
import {
    connectWallet,
    getCurrentWalletConnected,
    createTransaction,
    getTransaction,
    cancelOrder,
    confirmCompletion,
    deposit,
    raiseDispute,
    resolveDispute,
} from "./contracts/contractInteractions";

function App() {
    const [walletAddress, setWalletAddress] = useState("");
    const [status, setStatus] = useState("");
    const [partyB, setPartyB] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [amount, setAmount] = useState("");
    const [releaseFundsToPartyB, setReleaseFundsToPartyB] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
            const { address, status } = await getCurrentWalletConnected();
            setWalletAddress(address);
            setStatus(status);
        };
        fetchWallet();
    }, []);

    const handleConnectWallet = async () => {
        const { address, status } = await connectWallet();
        setWalletAddress(address);
        setStatus(status);
    };

    const handleCreateTransaction = async () => {
        try {
            const { transactionId, txHash } = await createTransaction(
                partyB,
                walletAddress
            );
            console.log("Transaction ID:", transactionId);
            console.log("Transaction Hash:", txHash);
            alert(
                `Transaction created successfully! Transaction ID: ${transactionId}, Transaction hash: ${txHash}`
            );
            setTransactionId(transactionId);
        } catch (error) {
            console.error("Error creating transaction:", error);
            alert("Error creating transaction");
        }
    };

    const handleGetTransaction = async () => {
        try {
            const transaction = await getTransaction(transactionId);
            setTransactionDetails(transaction);
        } catch (error) {
            console.error("Error getting transaction:", error);
            alert("Error getting transaction");
        }
    };

    const handleCancelOrder = async () => {
        try {
            const txHash = await cancelOrder(transactionId);
            console.log("Transaction Hash:", txHash);
            alert("Order cancelled successfully!");
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("Error cancelling order");
        }
    };

    const handleConfirmCompletion = async () => {
        try {
            const txHash = await confirmCompletion(transactionId);
            console.log("Transaction Hash:", txHash);
            alert("Completion confirmed successfully!");
        } catch (error) {
            console.error("Error confirming completion:", error);
            alert("Error confirming completion");
        }
    };

    const handleDeposit = async () => {
        try {
            const txHash = await deposit(transactionId, amount);
            console.log("Transaction Hash:", txHash);
            alert("Deposit made successfully!");
        } catch (error) {
            console.error("Error making deposit:", error);
            alert("Error making deposit");
        }
    };

    const handleRaiseDispute = async () => {
        try {
            const txHash = await raiseDispute(transactionId);
            console.log("Transaction Hash:", txHash);
            alert("Dispute raised successfully!");
        } catch (error) {
            console.error("Error raising dispute:", error);
            alert("Error raising dispute");
        }
    };

    const handleResolveDispute = async () => {
        try {
            const txHash = await resolveDispute(
                transactionId,
                releaseFundsToPartyB
            );
            console.log("Transaction Hash:", txHash);
            alert("Dispute resolved successfully!");
        } catch (error) {
            console.error("Error resolving dispute:", error);
            alert("Error resolving dispute");
        }
    };

    return (
        <div className="App">
            <div className="header">
                <div className="logo-name">
                    <h1 className="title">TerraLink</h1>
                </div>
                {!walletAddress && (
                    <button
                        className="walletBtn"
                        onClick={handleConnectWallet}
                    >
                        Connect Wallet
                    </button>
                )}

                {walletAddress && (
                    <p className="wallet-address">
                        Connected:{" "}
                        {`${walletAddress.substring(
                            0,
                            6
                        )}...${walletAddress.substring(
                            walletAddress.length - 4
                        )}`}
                    </p>
                )}
            </div>
            <div>
                <h2>Create Transaction</h2>
                <input
                    type="text"
                    placeholder="Party B Address"
                    value={partyB || ""}
                    onChange={(e) => setPartyB(e.target.value)}
                />
                <button onClick={handleCreateTransaction}>
                    Create Transaction
                </button>
            </div>
            <div>
                <h2>Get Transaction</h2>
                <input
                    type="text"
                    placeholder="Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                />
                <button onClick={handleGetTransaction}>Get Transaction</button>
                {transactionDetails && (
                    <div>
                        <h3>Transaction Details</h3>
                        <pre>{JSON.stringify(transactionDetails, null, 2)}</pre>
                    </div>
                )}
            </div>
            <div>
                <h2>Cancel Order</h2>
                <button onClick={handleCancelOrder}>Cancel Order</button>
            </div>
            <div>
                <h2>Confirm Completion</h2>
                <button onClick={handleConfirmCompletion}>
                    Confirm Completion
                </button>
            </div>
            <div>
                <h2>Deposit</h2>
                <input
                    type="text"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={handleDeposit}>Deposit</button>
            </div>
            <div>
                <h2>Raise Dispute</h2>
                <button onClick={handleRaiseDispute}>Raise Dispute</button>
            </div>
            <div>
                <h2>Resolve Dispute</h2>
                <label>
                    Release Funds to Party B:
                    <input
                        type="checkbox"
                        checked={releaseFundsToPartyB}
                        onChange={(e) =>
                            setReleaseFundsToPartyB(e.target.checked)
                        }
                    />
                </label>
                <button onClick={handleResolveDispute}>Resolve Dispute</button>
            </div>
        </div>
    );
}

export default App;
