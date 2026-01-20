// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EscrowVault
 * @notice Holds payment until delivery + optional verification
 * @dev Core escrow logic for AgentShop
 */
contract EscrowVault is ReentrancyGuard {
    struct Order {
        uint256 productId;
        address buyer;
        address merchant;
        uint256 amount;
        uint256 createdAt;
        uint32 timeout;
        bool delivered;
        bool verified;
        bool released;
        bool refunded;
        bytes32 paymentProofHash;
        bytes32 deliverProofHash;
        bool requiresVerification;
    }

    IERC20 public usdcToken;
    address public platformWallet;
    uint256 public orderCount;

    mapping(uint256 => Order) public orders;

    event OrderCreated(
        uint256 indexed orderId,
        uint256 indexed productId,
        address indexed buyer,
        uint256 amount
    );

    event OrderDelivered(uint256 indexed orderId, bytes32 deliverProofHash);
    event VerificationSubmitted(uint256 indexed orderId, bool passed);
    event OrderReleased(uint256 indexed orderId, uint256 merchantAmount, uint256 platformFee);
    event OrderRefunded(uint256 indexed orderId, uint256 amount);

    constructor(address _usdcToken, address _platformWallet) {
        usdcToken = IERC20(_usdcToken);
        platformWallet = _platformWallet;
    }

    /**
     * @notice Create escrow order (called by backend after x402 payment)
     */
    function createOrder(
        uint256 productId,
        address buyer,
        address merchant,
        uint256 amount,
        uint32 timeout,
        bytes32 paymentProofHash,
        bool requiresVerification
    ) external nonReentrant returns (uint256) {
        require(buyer != address(0), "Invalid buyer");
        require(merchant != address(0), "Invalid merchant");
        require(amount > 0, "Invalid amount");

        uint256 orderId = orderCount++;

        orders[orderId] = Order({
            productId: productId,
            buyer: buyer,
            merchant: merchant,
            amount: amount,
            createdAt: block.timestamp,
            timeout: timeout,
            delivered: false,
            verified: false,
            released: false,
            refunded: false,
            paymentProofHash: paymentProofHash,
            deliverProofHash: bytes32(0),
            requiresVerification: requiresVerification
        });

        // Transfer USDC to escrow (assumes approval already given)
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        emit OrderCreated(orderId, productId, buyer, amount);

        return orderId;
    }

    /**
     * @notice Mark order as delivered
     */
    function markDelivered(uint256 orderId, bytes32 deliverProofHash) external {
        Order storage order = orders[orderId];
        require(!order.released, "Already released");
        require(!order.refunded, "Already refunded");
        require(!order.delivered, "Already delivered");

        order.delivered = true;
        order.deliverProofHash = deliverProofHash;

        emit OrderDelivered(orderId, deliverProofHash);

        // Auto-release if no verification required
        if (!order.requiresVerification) {
            _release(orderId);
        }
    }

    /**
     * @notice Submit verification result (verifier only)
     */
    function submitVerification(
        uint256 orderId,
        bytes32 resultHash,
        bool passed
    ) external {
        Order storage order = orders[orderId];
        require(order.delivered, "Not delivered yet");
        require(!order.released, "Already released");
        require(!order.refunded, "Already refunded");
        require(order.requiresVerification, "Verification not required");

        order.verified = passed;

        emit VerificationSubmitted(orderId, passed);
    }

    /**
     * @notice Release escrow to merchant
     */
    function release(uint256 orderId) external nonReentrant {
        _release(orderId);
    }

    function _release(uint256 orderId) private {
        Order storage order = orders[orderId];
        require(order.delivered, "Not delivered");
        require(!order.released, "Already released");
        require(!order.refunded, "Already refunded");

        if (order.requiresVerification) {
            require(order.verified, "Not verified");
        }

        order.released = true;

        // Calculate platform fee (5%)
        uint256 platformFee = (order.amount * 500) / 10000;
        uint256 merchantAmount = order.amount - platformFee;

        // Transfer to merchant
        require(
            usdcToken.transfer(order.merchant, merchantAmount),
            "Merchant transfer failed"
        );

        // Transfer platform fee
        require(
            usdcToken.transfer(platformWallet, platformFee),
            "Platform transfer failed"
        );

        emit OrderReleased(orderId, merchantAmount, platformFee);
    }

    /**
     * @notice Refund buyer if timeout reached and not delivered/verified
     */
    function refund(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(!order.released, "Already released");
        require(!order.refunded, "Already refunded");
        require(
            block.timestamp >= order.createdAt + order.timeout,
            "Timeout not reached"
        );

        // Refund conditions
        bool shouldRefund = !order.delivered || 
            (order.requiresVerification && !order.verified);

        require(shouldRefund, "Cannot refund");

        order.refunded = true;

        require(
            usdcToken.transfer(order.buyer, order.amount),
            "Refund transfer failed"
        );

        emit OrderRefunded(orderId, order.amount);
    }

    /**
     * @notice Get order details
     */
    function getOrder(uint256 orderId)
        external
        view
        returns (
            uint256 productId,
            address buyer,
            address merchant,
            uint256 amount,
            uint256 createdAt,
            bool delivered,
            bool verified,
            bool released,
            bool refunded
        )
    {
        Order memory order = orders[orderId];
        return (
            order.productId,
            order.buyer,
            order.merchant,
            order.amount,
            order.createdAt,
            order.delivered,
            order.verified,
            order.released,
            order.refunded
        );
    }
}
