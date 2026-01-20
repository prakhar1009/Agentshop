# 🚀 AgentShop Quick Start Guide

**Complete setup in 15 minutes**

---

## Step 1: Fix TypeScript Errors (2 minutes)

```bash
cd /Users/prakharmishra/Desktop/AgentShop/backend
npm install
```

This installs all dependencies and resolves ALL TypeScript errors:
- ✅ dotenv, axios, fastify, prisma, etc.
- ✅ @types/node (fixes 'process' errors)
- ✅ All other type definitions

---

## Step 2: Gather Required Credentials (10 minutes)

### ✅ 1. Cronos Testnet Wallet (2 min)

**Get wallet + private key:**
```bash
# Option 1: MetaMask (recommended)
1. Install MetaMask browser extension
2. Create new wallet or use existing
3. Click on account → Account Details → Export Private Key
4. Copy private key (starts with 0x...)

# Option 2: Create with code
npm install -g @cronos-labs/hardhat
npx hardhat console --network cronosTestnet
```

**Add Cronos Testnet to MetaMask:**
- Network Name: `Cronos Testnet`
- RPC URL: `https://evm-t3.cronos.org`
- Chain ID: `338`
- Currency: `TCRO`
- Explorer: `https://explorer.cronos.org/testnet`

**Get test tokens (FREE):**
- Visit: https://cronos.org/faucet
- Enter your wallet address
- Request TCRO (for gas fees)
- Request devUSDC.e (for testing payments)

**Required for `.env`:**
```env
BACKEND_PRIVATE_KEY=0x... # Main wallet for backend
VERIFIER_PRIVATE_KEY=0x... # Create 2nd wallet for verifier agent
```

---

### ✅ 2. OpenAI API Key (2 min)

**Where to get:**
- Visit: https://platform.openai.com/api-keys
- Sign up or log in
- Click "Create new secret key"
- Name it "AgentShop"
- Copy key (starts with `sk-...`)

**Cost:** ~$0.01-0.05 per agent execution (very cheap)

**Required for `.env`:**
```env
OPENAI_API_KEY=sk-...
```

---

### ✅ 3. Database URL (5 min)

**Option A: Railway (recommended for production):**
```bash
1. Visit https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Click "Provision PostgreSQL"
5. Click on PostgreSQL → Variables → DATABASE_URL
6. Copy the entire connection string
```

**Option B: Local PostgreSQL (for testing):**
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14
createdb agentshop

# DATABASE_URL will be:
postgresql://localhost:5432/agentshop
```

**Required for `.env`:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

### ✅ 4. Security Keys (1 min)

**Generate with terminal:**
```bash
# Generate JWT secret (32 chars)
openssl rand -base64 32

# Generate encryption key (32 chars)
openssl rand -base64 32
```

**Required for `.env`:**
```env
JWT_SECRET=... # Output from first command
ENCRYPTION_KEY=... # Output from second command
```

---

### ✅ 5. NO API KEYS NEEDED! (Already Done)

**x402 Facilitator:** ✅ Public, no key required
**USDC Address:** ✅ Already in .env.example
**Facilitator URL:** ✅ Already in .env.example

These are pre-configured and ready:
```env
X402_FACILITATOR_URL=https://facilitator.cronoslabs.org/v2/x402
USDC_TOKEN_ADDRESS=0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0
X402_API_KEY= # Leave empty - not needed!
```

---

## Step 3: Configure .env File (2 min)

```bash
cd /Users/prakharmishra/Desktop/AgentShop/backend
cp .env.example .env
nano .env  # or use any text editor
```

**Fill in these values:**
```env
# Database
DATABASE_URL=postgresql://... # From Step 2.3

# Cronos Blockchain
BACKEND_PRIVATE_KEY=0x... # From Step 2.1
VERIFIER_PRIVATE_KEY=0x... # Create 2nd wallet

# AI Agent
OPENAI_API_KEY=sk-... # From Step 2.2

# Security
JWT_SECRET=... # From Step 2.4
ENCRYPTION_KEY=... # From Step 2.4

# Leave these as-is (already correct):
X402_FACILITATOR_URL=https://facilitator.cronoslabs.org/v2/x402
USDC_TOKEN_ADDRESS=0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0
CRONOS_RPC_URL=https://evm-t3.cronos.org
CRONOS_CHAIN_ID=338

# Fill after deploying contracts (Step 5):
PRODUCT_REGISTRY_ADDRESS=
ESCROW_VAULT_ADDRESS=
RECEIPT_REGISTRY_ADDRESS=
```

---

## Step 4: Initialize Database (1 min)

```bash
cd /Users/prakharmishra/Desktop/AgentShop/backend

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

**Expected output:**
```
✅ Prisma Client generated
✅ Database synchronized
✅ 10 tables created
```

---

## Step 5: Deploy Smart Contracts (5 min)

```bash
cd /Users/prakharmishra/Desktop/AgentShop/contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to Cronos testnet
npx hardhat run scripts/deploy.ts --network cronosTestnet
```

**Expected output:**
```
🚀 Deploying AgentShop contracts...
✅ ProductRegistry deployed to: 0xABC123...
✅ EscrowVault deployed to: 0xDEF456...
✅ ReceiptRegistry deployed to: 0xGHI789...
```

**Copy addresses to backend/.env:**
```env
PRODUCT_REGISTRY_ADDRESS=0xABC123...
ESCROW_VAULT_ADDRESS=0xDEF456...
RECEIPT_REGISTRY_ADDRESS=0xGHI789...
```

---

## Step 6: Start Backend (1 min)

```bash
cd /Users/prakharmishra/Desktop/AgentShop/backend
npm run dev
```

**Expected output:**
```
🚀 AgentShop Backend Started
Environment: development
Port: 3001
✅ Database: Connected
✅ x402 Facilitator: https://facilitator.cronoslabs.org/v2/x402
✅ Cron Jobs: Running
```

---

## Step 7: Test Backend (2 min)

```bash
# Test 1: Health check
curl http://localhost:3001/health

# Test 2: Create product
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test API Key",
    "description": "Test product",
    "priceUSDC": "0.10",
    "deliveryType": "INSTANT",
    "requiresVerification": false,
    "merchantAddress": "YOUR_WALLET_ADDRESS"
  }'

# Test 3: Get products
curl http://localhost:3001/api/products
```

---

## ✅ You're Done!

Backend is running with:
- ✅ Database connected
- ✅ Smart contracts deployed
- ✅ x402 ready (no API key needed!)
- ✅ All services operational

**Next:** Build frontend or test complete purchase flow

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### Error: "Invalid private key"
```bash
# Make sure it starts with 0x
# Example: 0xabcdef1234567890...
```

### Error: "OpenAI API error"
```bash
# Verify key is correct
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_KEY"
```

### TypeScript errors still showing
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

**Total Setup Time:** ~15 minutes  
**Cost:** $0 (all testnet, free OpenAI credit available)
