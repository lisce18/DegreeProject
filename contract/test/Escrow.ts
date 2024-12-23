import hre from "hardhat";
import { expect } from "chai";

describe("Escrow", function () {
    const deployEscrowFixture = async () => {
        const [mediator, buyer, seller] = await hre.ethers.getSigners();

        const Escrow = await hre.ethers.getContractFactory("Escrow");
        const escrow = await Escrow.deploy();

        return { escrow, mediator, buyer, seller };
    };

    describe("Deployment", function () {
        it("Should deploy the Escrow contract", async function () {
            const { escrow } = await deployEscrowFixture();
            expect(escrow.getAddress()).to.not.be.undefined;
        });
    });

    describe("Create Transaction", function () {
        it("Should allow the buyer to create a transaction", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await expect(
                escrow.connect(buyer).createTransaction(seller.address)
            ).to.emit(escrow, "TransactionCreated");

            const transaction = await escrow.getTransaction(0);
            const {
                amount,
                buyer: buyerAddress,
                seller: sellerAddress,
                currState,
                transactionId,
            } = transaction;
            expect(amount).to.equal(0);
            expect(buyerAddress).to.equal(buyer.address);
            expect(sellerAddress).to.equal(seller.address);
            expect(currState).to.equal(0);
            expect(transactionId).to.equal(0);
        });

        it("Should not allow the buyer to create a transaction with themselves", async function () {
            const { escrow, buyer } = await deployEscrowFixture();
            await expect(
                escrow.connect(buyer).createTransaction(buyer.address)
            ).to.be.revertedWith("Cannot create a transaction with yourself.");
        });
    });

    describe("Deposit Funds", function () {
        it("Should allow the buyer to deposit funds", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow.connect(seller).acceptTransaction(0);

            await escrow
                .connect(buyer)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            const transaction = await escrow.getTransaction(0);
            const { amount, currState } = transaction;
            expect(amount).to.equal(hre.ethers.parseEther("1.0"));
            expect(currState).to.equal(2);
        });

        it("Should not allow the buyer to deposit funds in the wrong state", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            escrow
                .connect(buyer)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });

            await expect(
                escrow
                    .connect(buyer)
                    .deposit(0, { value: hre.ethers.parseEther("1.0") })
            ).to.be.revertedWith("Payment already made.");
        });

        it("Should not allow the seller to deposit funds", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await expect(
                escrow
                    .connect(seller)
                    .deposit(0, { value: hre.ethers.parseEther("1.0") })
            ).to.be.revertedWith("Only the buyer can call this function.");
        });
    });

    describe("Confirm Completion", function () {
        it("Should allow the buyer to confirm completion", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow
                .connect(buyer)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            const initialsellerBalance = await hre.ethers.provider.getBalance(
                seller.address
            );
            await escrow.connect(buyer).confirmCompletion(0);
            const finalsellerBalance = await hre.ethers.provider.getBalance(
                seller.address
            );
            expect(finalsellerBalance - initialsellerBalance).to.equal(
                hre.ethers.parseEther("1.0")
            );
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(2);
        });

        it("Should not allow the buyer to confirm completion in the wrong state", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await expect(
                escrow.connect(buyer).confirmCompletion(0)
            ).to.be.revertedWith("Cannot confirm completion at this stage.");
        });

        it("Should not allow the seller to confirm completion", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow
                .connect(buyer)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });

            await expect(
                escrow.connect(seller).confirmCompletion(0)
            ).to.be.revertedWith("Only the buyer can call this function.");
        });
    });

    describe("Raise Dispute", function () {
        it("Should allow the buyer to raise a dispute", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow
                .connect(buyer)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            await escrow.connect(buyer).raiseDispute(0);
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(3);
        });

        it("Should not allow the buyer to raise a dispute in the wrong state", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await expect(
                escrow.connect(buyer).raiseDispute(0)
            ).to.be.revertedWith("Cannot raise a dispute at this stage.");
        });

        it("Should not allow the seller to raise a dispute", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow
                .connect(buyer)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });

            await expect(
                escrow.connect(seller).raiseDispute(0)
            ).to.be.revertedWith("Only the buyer can call this function.");
        });
    });

    describe("Resolve Dispute", function () {
        it("Should allow the mediator to resolve a dispute in favor of the seller", async function () {
            const { escrow, mediator, buyer, seller } =
                await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow
                .connect(buyer)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            await escrow.connect(buyer).raiseDispute(0);
            const initialsellerBalance = await hre.ethers.provider.getBalance(
                seller.address
            );
            await escrow.connect(mediator).resolveDispute(0, true);
            const finalsellerBalance = await hre.ethers.provider.getBalance(
                seller.address
            );
            expect(finalsellerBalance - initialsellerBalance).to.equal(
                hre.ethers.parseEther("1.0")
            );
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(2);
        });

        it("Should allow the mediator to resolve a dispute in favor of the buyer", async function () {
            const { escrow, mediator, buyer, seller } =
                await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow
                .connect(buyer)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            await escrow.connect(buyer).raiseDispute(0);
            const initialbuyerBalance = await hre.ethers.provider.getBalance(
                buyer.address
            );
            await escrow.connect(mediator).resolveDispute(0, false);
            const finalbuyerBalance = await hre.ethers.provider.getBalance(
                buyer.address
            );
            expect(finalbuyerBalance - initialbuyerBalance).to.equal(
                hre.ethers.parseEther("1.0")
            );
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(5);
        });

        it("Should not allow the mediator to resolve a dispute in the wrong state", async function () {
            const { escrow, mediator, buyer, seller } =
                await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow
                .connect(buyer)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            await escrow.connect(buyer).raiseDispute(0);
            await escrow.connect(mediator).resolveDispute(0, true);
            await expect(
                escrow.connect(mediator).resolveDispute(0, true)
            ).to.be.revertedWith("No dispute to resolve.");
        });

        it("Should not allow the mediator to resolve a dispute with an invalid transaction ID", async function () {
            const { escrow, mediator, buyer, seller } =
                await deployEscrowFixture();

            await escrow.connect(buyer).createTransaction(seller.address);

            await expect(
                escrow.connect(mediator).resolveDispute(1, true)
            ).to.be.revertedWith("No dispute to resolve.");
        });

        it("Should not allow either the buyer or the seller to resolve a dispute", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();

            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow
                .connect(buyer)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            await escrow.connect(buyer).raiseDispute(0);
            await expect(
                escrow.connect(buyer).resolveDispute(0, true)
            ).to.be.revertedWith("Only the mediator can call this function.");
            await expect(
                escrow.connect(seller).resolveDispute(0, true)
            ).to.be.revertedWith("Only the mediator can call this function.");
        });
    });

    describe("Cancel Order", function () {
        it("Should allow the buyer to cancel an order", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow.connect(buyer).cancelOrder(0);
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(4);
        });

        it("Should allow the seller to cancel an order", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await escrow.connect(seller).cancelOrder(0);
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(4);
        });

        it("Should not allow any party to cancel in the wrong state", async function () {
            const { escrow, buyer, seller } = await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await expect(escrow.connect(buyer).cancelOrder(0)).to.not.be
                .reverted;
            await expect(
                escrow.connect(buyer).cancelOrder(0)
            ).to.be.revertedWith("Order cannot be cancelled at this stage.");
            await expect(
                escrow.connect(seller).cancelOrder(0)
            ).to.be.revertedWith("Order cannot be cancelled at this stage.");
        });

        it("Should not allow the mediator to cancel the order", async function () {
            const { escrow, mediator, buyer, seller } =
                await deployEscrowFixture();
            await escrow.connect(buyer).createTransaction(seller.address);

            await expect(
                escrow.connect(mediator).cancelOrder(0)
            ).to.be.revertedWith(
                "Only the parties involved can call this function."
            );
        });
    });
});
