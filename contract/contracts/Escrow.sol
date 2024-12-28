// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

contract Escrow {
    struct EscrowTransaction {
        uint256 amount;
        address buyer;
        address seller;
        State currState;
        uint256 transactionId;
    }

    address public mediator;
    uint256 public transactionCounter;
    mapping(uint256 => EscrowTransaction) public transactions;

    enum State {CREATED, ACCEPTED, DEPOSITED, COMPLETED, DISPUTED, CANCELED, REFUNDED}

    event TransactionCreated(uint256 transactionId, address indexed buyer, address indexed seller);

    constructor() {
        mediator = msg.sender;
        transactionCounter = 0;
    }

    modifier onlyParty(uint256 _transactionId) {
        require(msg.sender == transactions[_transactionId].buyer || msg.sender == transactions[_transactionId].seller, "Only the parties involved can call this function.");
        _;
    }

    modifier onlyBuyer(uint256 _transactionId) {
        require(msg.sender == transactions[_transactionId].buyer, "Only the buyer can call this function.");
        _;
    }

    modifier onlySeller(uint256 _transactionId) {
        require(msg.sender == transactions[_transactionId].seller, "Only the seller can call this function.");
        _;
    }

    modifier onlyMediator() {
        require(msg.sender == mediator, "Only the mediator can call this function.");
        _;
    }

    function acceptTransaction(uint256 _transactionId)  external onlySeller(_transactionId) {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.CREATED, "Order cannot be accepted at this stage.");
        transaction.currState = State.ACCEPTED;
    }

    function createTransaction(address _seller) external returns (uint256){
        require(_seller != msg.sender, "Cannot create a transaction with yourself.");
        uint256 transactionId = transactionCounter;
        transactions[transactionId] = EscrowTransaction({
            amount: 0,
            buyer: msg.sender,
            seller: _seller,
            currState: State.CREATED,
            transactionId: transactionId
        });
        emit TransactionCreated(transactionId, msg.sender, _seller);
        transactionCounter++;
        return transactionId;
    }

    function getTransaction(uint256 _transactionId) external view returns(EscrowTransaction memory) {
        return transactions[_transactionId];
    }

    function deposit(uint256 _transactionId) external payable onlyBuyer(_transactionId) {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.ACCEPTED, "Payment already made.");
        transaction.amount += msg.value;
        transaction.currState = State.DEPOSITED;
    }

    function confirmCompletion(uint256 _transactionId) external onlyBuyer(_transactionId) {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.DEPOSITED, "Cannot confirm completion at this stage.");
        payable(transaction.seller).transfer(transaction.amount);
        transaction.currState = State.COMPLETED;
    }

    function raiseDispute(uint256 _transactionId) external onlyBuyer(_transactionId) {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.DEPOSITED, "Cannot raise a dispute at this stage.");
        transaction.currState = State.DISPUTED;
    }

    function resolveDispute(uint256 _transactionId, bool releaseFundsToSeller) external onlyMediator {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.DISPUTED, "No dispute to resolve.");
        if (releaseFundsToSeller) {
            payable(transaction.seller).transfer(transaction.amount);
            transaction.currState = State.COMPLETED;
        } else {
            payable(transaction.buyer).transfer(transaction.amount);
            transaction.currState = State.REFUNDED;
        }
    }

    function cancelOrder(uint256 _transactionId) external onlyParty(_transactionId) {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.CREATED, "Order cannot be cancelled at this stage.");
        transaction.currState = State.CANCELED;
    }
}