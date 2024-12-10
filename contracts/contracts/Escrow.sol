// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

contract Escrow {
    struct EscrowTransaction {
        uint256 amount;
        address partyA;
        address partyB;
        State currState;
        uint256 transactionId;
    }

    address public owner;
    uint256 public transactionCounter;
    mapping(uint256 => EscrowTransaction) public transactions;

    enum State {AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, DISPUTED, CANCELED, REFUNDED}

    event TransactionCreated(uint256 transactionId, address indexed partyA, address indexed partyB);

    constructor() {
        owner = msg.sender;
        transactionCounter = 0;
    }

    modifier onlyParty(uint256 _transactionId) {
        require(msg.sender == transactions[_transactionId].partyA || msg.sender == transactions[_transactionId].partyB, "Only the parties involved can call this function.");
        _;
    }

    modifier onlyPartyA(uint256 _transactionId) {
        require(msg.sender == transactions[_transactionId].partyA, "Only Party A can call this function.");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    function createTransaction(address _partyB) external returns (uint256) {
        require(_partyB != msg.sender, "Cannot create a transaction with yourself.");
        uint256 transactionId = transactionCounter;
        transactions[transactionId] = EscrowTransaction({
            amount: 0,
            partyA: msg.sender,
            partyB: _partyB,
            currState: State.AWAITING_PAYMENT,
            transactionId: transactionId
        });
        emit TransactionCreated(transactionId, msg.sender, _partyB);
        transactionCounter++;
        return transactionId;
    }

    function getTransaction(uint256 _transactionId) external view returns(EscrowTransaction memory) {
        return transactions[_transactionId];
    }

    function deposit(uint256 _transactionId) external payable onlyPartyA(_transactionId) {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.AWAITING_PAYMENT, "Payment already made.");
        transaction.amount += msg.value;
        transaction.currState = State.AWAITING_DELIVERY;
    }

    function confirmCompletion(uint256 _transactionId) external onlyPartyA(_transactionId) {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.AWAITING_DELIVERY, "Cannot confirm completion at this stage.");
        payable(transaction.partyB).transfer(transaction.amount);
        transaction.currState = State.COMPLETE;
    }

    function raiseDispute(uint256 _transactionId) external onlyPartyA(_transactionId) {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.AWAITING_DELIVERY, "Cannot raise a dispute at this stage.");
        transaction.currState = State.DISPUTED;
    }

    function resolveDispute(uint256 _transactionId, bool releaseFundsToPartyB) external onlyOwner {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.DISPUTED, "No dispute to resolve.");
        if (releaseFundsToPartyB) {
            payable(transaction.partyB).transfer(transaction.amount);
            transaction.currState = State.COMPLETE;
        } else {
            payable(transaction.partyA).transfer(transaction.amount);
            transaction.currState = State.REFUNDED;
        }
    }

    function cancelOrder(uint256 _transactionId) external onlyParty(_transactionId) {
        EscrowTransaction storage transaction = transactions[_transactionId];
        require(transaction.currState == State.AWAITING_PAYMENT, "Order cannot be cancelled at this stage.");
        transaction.currState = State.CANCELED;
    }
}
