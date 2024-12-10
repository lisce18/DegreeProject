import hre from "hardhat";
import { expect } from "chai";

describe("Escrow", function () {
    const deployEscrowFixture = async () => {
        const [owner, partyA, partyB] = await hre.ethers.getSigners();

        const Escrow = await hre.ethers.getContractFactory("Escrow");
        const escrow = await Escrow.deploy();

        return { escrow, owner, partyA, partyB };
    };

    describe("Deployment", function () {
        it("Should deploy the Escrow contract", async function () {
            const { escrow } = await deployEscrowFixture();
            expect(escrow.getAddress()).to.not.be.undefined;
        });
    });

    describe("Create Transaction", function () {
        it("Should allow Party A to create a transaction", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await expect(
                escrow.connect(partyA).createTransaction(partyB.address)
            ).to.emit(escrow, "TransactionCreated");

            const transaction = await escrow.getTransaction(0);
            const {
                amount,
                partyA: partyAAddress,
                partyB: partyBAddress,
                currState,
                transactionId,
            } = transaction;
            expect(amount).to.equal(0);
            expect(partyAAddress).to.equal(partyA.address);
            expect(partyBAddress).to.equal(partyB.address);
            expect(currState).to.equal(0);
            expect(transactionId).to.equal(0);
        });

        it("Should not allow Party A to create a transaction with themselves", async function () {
            const { escrow, partyA } = await deployEscrowFixture();
            await expect(
                escrow.connect(partyA).createTransaction(partyA.address)
            ).to.be.revertedWith("Cannot create a transaction with yourself.");
        });
    });

    describe("Deposit Funds", function () {
        it("Should allow Party A to deposit funds", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow
                .connect(partyA)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            const transaction = await escrow.getTransaction(0);
            const { amount, currState } = transaction;
            expect(amount).to.equal(hre.ethers.parseEther("1.0"));
            expect(currState).to.equal(1);
        });

        it("Should not allow Party A to deposit funds in the wrong state", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            escrow
                .connect(partyA)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });

            await expect(
                escrow
                    .connect(partyA)
                    .deposit(0, { value: hre.ethers.parseEther("1.0") })
            ).to.be.revertedWith("Payment already made.");
        });

        it("Should not allow Party B to deposit funds", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await expect(
                escrow
                    .connect(partyB)
                    .deposit(0, { value: hre.ethers.parseEther("1.0") })
            ).to.be.revertedWith("Only Party A can call this function.");
        });
    });

    describe("Confirm Completion", function () {
        it("Should allow Party A to confirm completion", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow
                .connect(partyA)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            const initialPartyBBalance = await hre.ethers.provider.getBalance(
                partyB.address
            );
            await escrow.connect(partyA).confirmCompletion(0);
            const finalPartyBBalance = await hre.ethers.provider.getBalance(
                partyB.address
            );
            expect(finalPartyBBalance - initialPartyBBalance).to.equal(
                hre.ethers.parseEther("1.0")
            );
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(2);
        });

        it("Should not allow Party A to confirm completion in the wrong state", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await expect(
                escrow.connect(partyA).confirmCompletion(0)
            ).to.be.revertedWith("Cannot confirm completion at this stage.");
        });

        it("Should not allow Party B to confirm completion", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow
                .connect(partyA)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });

            await expect(
                escrow.connect(partyB).confirmCompletion(0)
            ).to.be.revertedWith("Only Party A can call this function.");
        });
    });

    describe("Raise Dispute", function () {
        it("Should allow Party A to raise a dispute", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow
                .connect(partyA)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            await escrow.connect(partyA).raiseDispute(0);
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(3);
        });

        it("Should not allow Party A to raise a dispute in the wrong state", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await expect(
                escrow.connect(partyA).raiseDispute(0)
            ).to.be.revertedWith("Cannot raise a dispute at this stage.");
        });

        it("Should not allow Party B to raise a dispute", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow
                .connect(partyA)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });

            await expect(
                escrow.connect(partyB).raiseDispute(0)
            ).to.be.revertedWith("Only Party A can call this function.");
        });
    });

    describe("Resolve Dispute", function () {
        it("Should allow the owner to resolve a dispute in favor of Party B", async function () {
            const { escrow, owner, partyA, partyB } =
                await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow
                .connect(partyA)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            await escrow.connect(partyA).raiseDispute(0);
            const initialPartyBBalance = await hre.ethers.provider.getBalance(
                partyB.address
            );
            await escrow.connect(owner).resolveDispute(0, true);
            const finalPartyBBalance = await hre.ethers.provider.getBalance(
                partyB.address
            );
            expect(finalPartyBBalance - initialPartyBBalance).to.equal(
                hre.ethers.parseEther("1.0")
            );
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(2);
        });

        it("Should allow the owner to resolve a dispute in favor of Party A", async function () {
            const { escrow, owner, partyA, partyB } =
                await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow
                .connect(partyA)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            await escrow.connect(partyA).raiseDispute(0);
            const initialPartyABalance = await hre.ethers.provider.getBalance(
                partyA.address
            );
            await escrow.connect(owner).resolveDispute(0, false);
            const finalPartyABalance = await hre.ethers.provider.getBalance(
                partyA.address
            );
            expect(finalPartyABalance - initialPartyABalance).to.equal(
                hre.ethers.parseEther("1.0")
            );
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(5);
        });

        it("Should not allow the owner to resolve a dispute in the wrong state", async function () {
            const { escrow, owner, partyA, partyB } =
                await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow
                .connect(partyA)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            await escrow.connect(partyA).raiseDispute(0);
            await escrow.connect(owner).resolveDispute(0, true);
            await expect(
                escrow.connect(owner).resolveDispute(0, true)
            ).to.be.revertedWith("No dispute to resolve.");
        });

        it("Should not allow the owner to resolve a dispute with an invalid transaction ID", async function () {
            const { escrow, owner, partyA, partyB } =
                await deployEscrowFixture();

            await escrow.connect(partyA).createTransaction(partyB.address);

            await expect(
                escrow.connect(owner).resolveDispute(1, true)
            ).to.be.revertedWith("No dispute to resolve.");
        });

        it("Should not allow either Party A or Party B to resolve a dispute", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();

            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow
                .connect(partyA)
                .deposit(0, { value: hre.ethers.parseEther("1.0") });
            await escrow.connect(partyA).raiseDispute(0);
            await expect(
                escrow.connect(partyA).resolveDispute(0, true)
            ).to.be.revertedWith("Only the owner can call this function.");
            await expect(
                escrow.connect(partyB).resolveDispute(0, true)
            ).to.be.revertedWith("Only the owner can call this function.");
        });
    });

    describe("Cancel Order", function () {
        it("Should allow Party A to cancel an order", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow.connect(partyA).cancelOrder(0);
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(4);
        });

        it("Should allow Party B to cancel an order", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await escrow.connect(partyB).cancelOrder(0);
            const transaction = await escrow.getTransaction(0);
            const { currState } = transaction;
            expect(currState).to.equal(4);
        });

        it("Should not allow any party to cancel in the wrong state", async function () {
            const { escrow, partyA, partyB } = await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await expect(escrow.connect(partyA).cancelOrder(0)).to.not.be
                .reverted;
            await expect(
                escrow.connect(partyA).cancelOrder(0)
            ).to.be.revertedWith("Order cannot be cancelled at this stage.");
            await expect(
                escrow.connect(partyB).cancelOrder(0)
            ).to.be.revertedWith("Order cannot be cancelled at this stage.");
        });

        it("Should not allow the mediator to cancel the order", async function () {
            const { escrow, owner, partyA, partyB } =
                await deployEscrowFixture();
            await escrow.connect(partyA).createTransaction(partyB.address);

            await expect(
                escrow.connect(owner).cancelOrder(0)
            ).to.be.revertedWith(
                "Only the parties involved can call this function."
            );
        });
    });
});
