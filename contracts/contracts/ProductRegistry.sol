// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProductRegistry
 * @notice Stores product metadata and on-chain policy for AgentShop
 */
contract ProductRegistry {
    struct Product {
        address merchant;
        uint256 price;              // in USDC smallest units (6 decimals)
        uint16 platformFeeBps;      // e.g. 500 = 5%
        uint32 deliveryTimeout;     // seconds
        bool requiresVerification;
        bytes32 metadataHash;       // IPFS or JSON hash
        bool active;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductCreated(
        uint256 indexed productId,
        address indexed merchant,
        uint256 price,
        bool requiresVerification
    );

    event ProductUpdated(uint256 indexed productId, bool active);

    /**
     * @notice Create a new product
     */
    function createProduct(
        uint256 price,
        uint16 platformFeeBps,
        uint32 deliveryTimeout,
        bool requiresVerification,
        bytes32 metadataHash
    ) external returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        require(platformFeeBps <= 1000, "Platform fee too high"); // Max 10%
        require(deliveryTimeout >= 300, "Timeout too short"); // Min 5 minutes

        uint256 productId = productCount++;

        products[productId] = Product({
            merchant: msg.sender,
            price: price,
            platformFeeBps: platformFeeBps,
            deliveryTimeout: deliveryTimeout,
            requiresVerification: requiresVerification,
            metadataHash: metadataHash,
            active: true
        });

        emit ProductCreated(productId, msg.sender, price, requiresVerification);

        return productId;
    }

    /**
     * @notice Get product details
     */
    function getProduct(uint256 productId) 
        external 
        view 
        returns (
            address merchant,
            uint256 price,
            uint16 platformFeeBps,
            uint32 deliveryTimeout,
            bool requiresVerification,
            bytes32 metadataHash,
            bool active
        ) 
    {
        Product memory product = products[productId];
        return (
            product.merchant,
            product.price,
            product.platformFeeBps,
            product.deliveryTimeout,
            product.requiresVerification,
            product.metadataHash,
            product.active
        );
    }

    /**
     * @notice Set product active status (merchant only)
     */
    function setActive(uint256 productId, bool active) external {
        require(products[productId].merchant == msg.sender, "Not merchant");
        products[productId].active = active;
        emit ProductUpdated(productId, active);
    }
}
