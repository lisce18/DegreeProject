import Web3 from "web3";
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const web3 = new Web3(new Web3.providers.WebsocketProvider(alchemyKey));

const ABI = require("./Escrow.json");
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const escrowContract = new web3.eth.Contract(ABI, contractAddress);

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            return {
                address: addressArray[0],
                status: "",
            };
        } catch (err) {
            return {
                address: "",
                status: err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    Want to use this application? <br />
                    <a
                        href="https://metamask.io/download.html"
                        target="blank"
                    >
                        Install MetaMask for your browser!
                    </a>
                </span>
            ),
        };
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if (accounts.length > 0) {
                return {
                    address: accounts[0],
                    status: "",
                };
            } else {
                return {
                    address: "",
                    status: "Connect your wallet!",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    Want to use this application? <br />
                    <a
                        href="https://metamask.io/download.html"
                        target="blank"
                    >
                        Install MetaMask for your browser!
                    </a>
                </span>
            ),
        };
    }
};

export const createTransaction = async (partyB, walletAddress) => {
    if (!window.ethereum) {
        return {
            status: "MetaMask is not installed. Please install MetaMask to proceed.",
        };
    }

    try {
        const encodedABI = escrowContract.methods
            .createTransaction(partyB)
            .encodeABI();

        const transactionParams = {
            to: escrowContract.options.address,
            from: walletAddress,
            data: encodedABI,
        };

        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParams],
        });

        // Wait for the transaction to be mined
        let receipt = null;
        while (receipt === null) {
            receipt = await web3.eth.getTransactionReceipt(txHash);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
        }

        // Parse the logs to extract the transaction ID
        const iface = new web3.eth.Contract(ABI, contractAddress).options
            .jsonInterface;
        const log = receipt.logs.find((log) => {
            try {
                const parsedLog = iface.parseLog(log);
                return parsedLog.name === "TransactionCreated";
            } catch (e) {
                return false;
            }
        });

        if (!log) {
            throw new Error("TransactionCreated event not found");
        }

        const parsedLog = iface.parseLog(log);
        const transactionId = parsedLog.args.transactionId.toString();

        return {
            status: `Transaction created successfully! Transaction hash: ${txHash}`,
            txHash,
            transactionId,
        };
    } catch (err) {
        console.error("Error creating transaction:", err.message);
        return {
            status: `Error creating transaction: ${err.message}`,
            error: err,
        };
    }
};

export const deposit = async (walletAddress, amount) => {
    if (!window.ethereum) {
        return {
            status: "MetaMask is not installed. Please install MetaMask to proceed.",
        };
    }

    try {
        const encodedABI = escrowContract.methods.deposit().encodeABI();

        const transactionParams = {
            to: escrowContract.options.address,
            from: walletAddress,
            value: web3.utils.toWei(amount, "ether"),
            data: encodedABI,
        };

        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParams],
        });

        return {
            status: `Deposit made successfully! Transaction hash: ${txHash}`,
            txHash,
        };
    } catch (err) {
        console.error("Error making deposit:", err.message);
        return {
            status: `Error making deposit: ${err.message}`,
            error: err,
        };
    }
};

export const confirmCompletion = async (walletAddress) => {
    if (!window.ethereum) {
        return {
            status: "MetaMask is not installed. Please install MetaMask to proceed.",
        };
    }

    try {
        const encodedABI = escrowContract.methods.confirmDelivery().encodeABI();

        const transactionParams = {
            to: escrowContract.options.address,
            from: walletAddress,
            data: encodedABI,
        };

        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParams],
        });

        return {
            status: `Delivery confirmed successfully! Transaction hash: ${txHash}`,
            txHash,
        };
    } catch (err) {
        console.error("Error confirming delivery:", err.message);
        return {
            status: `Error confirming delivery: ${err.message}`,
            error: err,
        };
    }
};

export const cancelOrder = async (walletAddress) => {
    if (!window.ethereum) {
        return {
            status: "MetaMask is not installed. Please install MetaMask to proceed.",
        };
    }

    try {
        const encodedABI = escrowContract.methods.cancelOrder().encodeABI();

        const transactionParams = {
            to: escrowContract.options.address,
            from: walletAddress,
            data: encodedABI,
        };

        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParams],
        });

        return {
            status: `Order cancelled successfully! Transaction hash: ${txHash}`,
            txHash,
        };
    } catch (err) {
        console.error("Error cancelling order:", err.message);
        return {
            status: `Error cancelling order: ${err.message}`,
            error: err,
        };
    }
};

export const raiseDispute = async (walletAddress) => {
    if (!window.ethereum) {
        return {
            status: "MetaMask is not installed. Please install MetaMask to proceed.",
        };
    }

    try {
        const encodedABI = escrowContract.methods.raiseDispute().encodeABI();

        const transactionParams = {
            to: escrowContract.options.address,
            from: walletAddress,
            data: encodedABI,
        };

        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParams],
        });

        return {
            status: `Dispute raised successfully! Transaction hash: ${txHash}`,
            txHash,
        };
    } catch (err) {
        console.error("Error raising dispute:", err.message);
        return {
            status: `Error raising dispute: ${err.message}`,
            error: err,
        };
    }
};

export const resolveDispute = async (walletAddress, releaseFundsToSeller) => {
    if (!window.ethereum) {
        return {
            status: "MetaMask is not installed. Please install MetaMask to proceed.",
        };
    }

    try {
        const encodedABI = escrowContract.methods
            .resolveDispute(releaseFundsToSeller)
            .encodeABI();

        const transactionParams = {
            to: escrowContract.options.address,
            from: walletAddress,
            data: encodedABI,
        };

        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParams],
        });

        return {
            status: `Dispute resolved successfully! Transaction hash: ${txHash}`,
            txHash,
        };
    } catch (err) {
        console.error("Error resolving dispute:", err.message);
        return {
            status: `Error resolving dispute: ${err.message}`,
            error: err,
        };
    }
};

export const getTransaction = async (transactionId) => {
    try {
        const transaction = await escrowContract.methods
            .getTransaction(transactionId)
            .call();
        return transaction;
    } catch (err) {
        console.error("Error fetching transaction details:", err);
        throw new Error("Unable to fetch transaction details");
    }
};
