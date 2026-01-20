# 🦊 MetaMask Setup Guide for AgentShop

## ✅ Errors Fixed

1. **MetaMask SDK dependency** - Installed compatible wagmi 2.x versions
2. **Web3Provider configuration** - Updated to use getDefaultWallets
3. **Products filter error** - Added array safety checks
4. **RainbowKit provider** - Fixed props compatibility

---

## 🦊 Connect MetaMask to AgentShop

### **Step 1: Open the Application**
👉 **http://localhost:3000**

### **Step 2: Install MetaMask (if not installed)**
- Go to https://metamask.io/download/
- Install MetaMask browser extension
- Create or import a wallet

### **Step 3: Add Cronos Testnet to MetaMask**

#### Option A: Automatic (Recommended)
1. Click "Connect Wallet" button in AgentShop
2. Select MetaMask
3. Approve network switch when prompted
4. MetaMask will auto-add Cronos Testnet

#### Option B: Manual Setup
1. Open MetaMask
2. Click network dropdown (top)
3. Click "Add Network" or "Add a network manually"
4. Enter these details:

```
Network Name: Cronos Testnet
RPC URL: https://evm-t3.cronos.org
Chain ID: 338
Currency Symbol: TCRO
Block Explorer: https://explorer.cronos.org/testnet
```

5. Click "Save"

### **Step 4: Get Testnet Tokens**

You need TCRO for gas (even though x402 is gasless, you need some for network operations):

1. Go to: https://faucet.cronos.org
2. Select "Testnet"
3. Enter your wallet address
4. Request tokens
5. Wait 30 seconds for tokens to arrive

### **Step 5: Connect Wallet to AgentShop**

1. Go to http://localhost:3000
2. Click "Connect Wallet" button (top right)
3. Select "MetaMask" from the wallet list
4. Approve connection in MetaMask popup
5. Your address will appear in navbar
6. You're connected! ✅

---

## 🎯 Test the Application with MetaMask

### **1. Create a Product (Merchant Flow)**
```
→ Connected? ✅
→ Go to Dashboard: http://localhost:3000/dashboard
→ Click "+ Create Product"
→ Fill in:
   Name: Test API Key
   Description: Test product for demo
   Price: 0.50 (USDC)
   Delivery: instant
   ✓ Require verification
→ Click "Create Product"
→ Product appears in marketplace
```

### **2. Browse Marketplace**
```
→ Go to: http://localhost:3000/marketplace
→ See your created product
→ Search and filter products
→ Click product to view details
```

### **3. Purchase a Product**
```
→ Connected? ✅
→ Go to product detail page
→ Click "Buy Now"
→ MetaMask popup will appear for transaction
→ Approve transaction
→ Order created in backend
```

### **4. Chat with AI Agent**
```
→ Go to: http://localhost:3000/agent
→ Type: "Find me products under $1"
→ Agent will search and respond
→ Try: "Buy the cheapest API"
→ Agent will execute purchase flow
```

### **5. View Stats**
```
→ Dashboard: See your products and orders
→ Verifier: See verification stats
→ Marketplace: Browse all products
```

---

## 🔧 Wallet Info Display

When connected, you'll see:
- ✅ Your wallet address (shortened)
- ✅ Network: Cronos Testnet
- ✅ Balance (TCRO)
- ✅ Disconnect option

---

## 🎨 What's Working Now

### Frontend (Port 3000) ✅
- Beautiful DataForge-inspired UI
- Wallet connection with RainbowKit
- MetaMask integration
- All 6 pages functional
- Real-time API data

### Backend (Port 3001) ✅
- REST API active
- Database connected
- Smart contracts deployed
- x402 configured

### Wallet Features ✅
- Connect/Disconnect
- Network switching
- Transaction signing
- Balance display
- Multi-wallet support (MetaMask, WalletConnect, Coinbase)

---

## 🐛 Troubleshooting

### MetaMask doesn't appear in wallet list
- Refresh the page
- Make sure MetaMask is installed and unlocked
- Clear browser cache and try again

### Wrong network error
- Click the network name in MetaMask
- Switch to "Cronos Testnet"
- If not in list, add manually (see Step 3)

### Transaction fails
- Check you have TCRO for gas
- Visit faucet: https://faucet.cronos.org
- Wait for tokens to arrive
- Try transaction again

### Connection rejected
- Click "Connect Wallet" again
- Approve in MetaMask popup
- Make sure MetaMask is unlocked

---

## 📊 Current Status

```
✅ Frontend: http://localhost:3000 (Running)
✅ Backend: http://localhost:3001 (Running)
✅ MetaMask: Compatible and tested
✅ Cronos Testnet: Configured
✅ Wallet Connection: Working
✅ All Pages: Accessible
```

---

## 🎉 You're Ready!

Open **http://localhost:3000** and click **"Connect Wallet"** to get started!

Your AgentShop is fully operational with MetaMask support! 🚀
