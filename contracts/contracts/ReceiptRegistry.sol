// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReceiptRegistry
 * @notice Records receipts for completed transactions
 * @dev Cheaper than NFT minting, still provides on-chain proof
 */
contract ReceiptRegistry {
    struct Receipt {
        uint256 orderId;
        address buyer;
        address merchant;
        uint256 amount;
        uint256 timestamp;
        bool exists;
    }

    mapping(uint256 => Receipt) public receipts;
    uint256 public receiptCount;

    event ReceiptRecorded(
        uint256 indexed receiptId,
        uint256 indexed orderId,
        address indexed buyer,
        address merchant,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @notice Record a receipt
     */
    function recordReceipt(
        uint256 orderId,
        address buyer,
        address merchant,
        uint256 amount
    ) external returns (uint256) {
        uint256 receiptId = receiptCount++;

        receipts[receiptId] = Receipt({
            orderId: orderId,
            buyer: buyer,
            merchant: merchant,
            amount: amount,
            timestamp: block.timestamp,
            exists: true
        });

        emit ReceiptRecorded(
            receiptId,
            orderId,
            buyer,
            merchant,
            amount,
            block.timestamp
        );

        return receiptId;
    }

    /**
     * @notice Get receipt details
     */
    function getReceipt(uint256 receiptId)
        external
        view
        returns (
            uint256 orderId,
            address buyer,
            address merchant,
            uint256 amount,
            uint256 timestamp
        )
    {
        Receipt memory receipt = receipts[receiptId];
        require(receipt.exists, "Receipt not found");

        return (
            receipt.orderId,
            receipt.buyer,
            receipt.merchant,
            receipt.amount,
            receipt.timestamp
        );
    }

    /**
     * @notice Check if receipt exists
     */
    function receiptExists(uint256 receiptId) external view returns (bool) {
        return receipts[receiptId].exists;
    }
}
