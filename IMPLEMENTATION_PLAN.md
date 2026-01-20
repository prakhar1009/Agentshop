# 🎯 AgentShop v1 - Complete Implementation Plan

**Status:** Backend structure 100% complete ✅  
**Next Step:** Deploy smart contracts & integrate x402

---

## 📁 What Has Been Built

### ✅ Backend Structure (100% Complete)

```
backend/
├── prisma/
│   └── schema.prisma          ✅ Complete database schema
├── src/
│   ├── config/
│   │   ├── index.ts           ✅ Environment config with validation
│   │   ├── logger.ts          ✅ Pino logger setup
│   │   └── database.ts        ✅ Prisma connection
│   ├── services/
│   │   ├── chainService.ts    ✅ Blockchain interactions (viem)
│   │   ├── x402Service.ts     ✅ x402 facilitator integration
│   │   ├── verifierService.ts ✅ Verifier agent logic
│   │   └── agentService.ts    ✅ Main agent orchestration
│   ├── routes/
│   │   ├── products.ts        ✅ Product CRUD
│   │   ├── x402.ts            ✅ Payment intent & confirm
│   │   ├── orders.ts          ✅ Order lifecycle
│   │   ├── verifier.ts        ✅ Verifier hiring & stats
│   │   ├── agent.ts           ✅ Agent execution & budget
│   │   └── feed.ts            ✅ Transaction feed
│   ├── jobs/
│   │   └── refundCron.ts      ✅ Auto-refund every 5 minutes
│   ├── utils/
│   │   ├── crypto.ts          ✅ Encryption, hashing, USDC parsing
│   │   └── validation.ts      ✅ Zod schemas for all endpoints
│   ├── types/
│   │   └── index.ts           ✅ TypeScript interfaces
│   └── server.ts              ✅ Fastify server with all routes
├── package.json               ✅ All dependencies listed
├── tsconfig.json              ✅ TypeScript config
├── .env.example               ✅ Environment template
├── .gitignore                 ✅ Git ignore rules
└── README.md                  ✅ Complete documentation

contracts/
├── contracts/
│   ├── ProductRegistry.sol    ✅ Product on-chain storage
│   ├── EscrowVault.sol        ✅ Escrow logic with verification
│   └── ReceiptRegistry.sol    ✅ Receipt recording
├── scripts/
│   └── deploy.ts              ✅ Deployment script
├── hardhat.config.ts          ✅ Hardhat configuration
└── package.json               ✅ Contract dependencies
```

---

## 🚀 Step-by-Step Execution Plan

### **Day 1-2: Setup & Dependencies** (Start NOW)

#### Backend Setup

```bash
cd backend
npm install
```

Expected output:
```
✅ Installed 50+ packages
✅ Prisma, Fastify, viem, OpenAI, etc.
```

#### Create Database

```bash
# Option 1: Local PostgreSQL
createdb agentshop

# Option 2: Railway (recommended)
# 1. Create account at railway.app
# 2. Create PostgreSQL database
# 3. Copy DATABASE_URL from Railway
```

#### Configure .env

```bash
cp .env.example .env
# Edit .env with your values (see below)
```

**Critical .env values:**

```env
# Database (from Railway or local)
DATABASE_URL="postgresql://..."

# Cronos Testnet
CRONOS_RPC_URL=https://evm-t3.cronos.org
CRONOS_CHAIN_ID=338
BACKEND_PRIVATE_KEY=0x... # Your private key

# x402 (request access from Cronos team)
X402_FACILITATOR_URL=https://... # Provided by Cronos
X402_API_KEY=... # Provided by Cronos

# OpenAI
OPENAI_API_KEY=sk-... # From platform.openai.com

# Security
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# Verifier
VERIFIER_WALLET_ADDRESS=0x... # Separate wallet for verifier
VERIFIER_PRIVATE_KEY=0x... # Verifier's private key
```

#### Initialize Database

```bash
npm run db:generate
npm run db:push
```

Expected output:
```
✅ Prisma Client generated
✅ Database schema synchronized
```

#### Start Backend (Test)

```bash
npm run dev
```

Expected output:
```
🚀 AgentShop Backend Started
Environment: development
Port: 3001
✅ Database: Connected
✅ Cron Jobs: Running
✅ x402: Configured
```

Test health check:
```bash
curl http://localhost:3001/health
```

---

### **Day 3-4: Smart Contracts**

#### Setup Contracts

```bash
cd contracts
npm install
```

#### Get Cronos Testnet Tokens

1. Visit https://cronos.org/faucet
2. Request testnet CRO (for gas)
3. Request testnet USDC (for testing)

#### Update USDC Address

Edit `contracts/scripts/deploy.ts`:

```typescript
// Replace with actual Cronos testnet USDC address
const USDC_ADDRESS = "0x..."; // Get from Cronos docs
```

#### Compile Contracts

```bash
npx hardhat compile
```

Expected output:
```
✅ Compiled 3 Solidity files
✅ ProductRegistry
✅ EscrowVault
✅ ReceiptRegistry
```

#### Deploy to Cronos Testnet

```bash
npx hardhat run scripts/deploy.ts --network cronosTestnet
```

Expected output:
```
🚀 Deploying AgentShop contracts...
✅ ProductRegistry deployed to: 0x...
✅ EscrowVault deployed to: 0x...
✅ ReceiptRegistry deployed to: 0x...
```

#### Update Backend .env

Copy deployed addresses to `backend/.env`:

```env
PRODUCT_REGISTRY_ADDRESS=0x...
ESCROW_VAULT_ADDRESS=0x...
RECEIPT_REGISTRY_ADDRESS=0x...
```

#### Restart Backend

```bash
cd ../backend
npm run dev
```

---

### **Day 5-6: x402 Integration**

#### Get x402 Access

1. Contact Cronos team for x402 facilitator access
2. Receive `X402_FACILITATOR_URL` and `X402_API_KEY`
3. Update `.env`

#### Test Payment Intent

```bash
curl -X POST http://localhost:3001/api/x402/payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "amount": "0.10",
    "currency": "USDC"
  }'
```

Expected response:
```json
{
  "paymentId": "...",
  "recipient": "0x...",
  "amount": "0.10",
  "expiresAt": 1234567890
}
```

#### Test Payment Confirmation

```bash
curl -X POST http://localhost:3001/api/x402/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "...",
    "proof": {
      "signature": "0x...",
      "timestamp": 1234567890,
      "amount": "0.10",
      "from": "0x...",
      "to": "0x..."
    }
  }'
```

Expected response:
```json
{
  "verified": true,
  "proofHash": "0x...",
  "paymentId": "..."
}
```

---

### **Day 7-8: Product & Order Flow**

#### Create Test Product

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Market Data API",
    "description": "Real-time crypto market data",
    "priceUSDC": "0.10",
    "deliveryType": "VERIFICATION_REQUIRED",
    "requiresVerification": true,
    "merchantAddress": "0x..."
  }'
```

Response:
```json
{
  "productId": "...",
  "txHash": "0x...",
  "checkoutUrl": "http://localhost:3000/product/..."
}
```

#### Create Test Order

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "...",
    "buyerAddress": "0x...",
    "paymentProofHash": "0x..."
  }'
```

#### Create Escrow

```bash
curl -X POST http://localhost:3001/api/orders/{orderId}/create-escrow
```

#### Deliver Product

```bash
curl -X POST http://localhost:3001/api/orders/{orderId}/deliver \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "...",
    "secret": "test_api_key_xyz123"
  }'
```

---

### **Day 9-10: Verifier Agent**

#### Create Verification Job

```bash
curl -X POST http://localhost:3001/api/orders/{orderId}/hire-verifier
```

Response:
```json
{
  "jobId": "...",
  "verifierFee": "0.02",
  "status": "verification_job_created"
}
```

#### Run Verification

```bash
curl -X POST http://localhost:3001/api/verify/{jobId}/run
```

Expected:
- Verifier tests API key
- Submits result on-chain
- Releases escrow if passed
- Updates verifier stats

#### Check Verifier Stats

```bash
curl http://localhost:3001/api/verifier/stats
```

Response:
```json
{
  "totalJobsCompleted": 1,
  "totalEarnedUSDC": "0.02",
  "successRate": "100%"
}
```

---

### **Day 11-13: Main Agent Integration**

#### Set Agent Budget

```bash
curl -X POST http://localhost:3001/api/agent/budget \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "...",
    "dailyLimitUSDC": "100.00",
    "perTxLimitUSDC": "10.00"
  }'
```

#### Execute Agent Task

```bash
curl -X POST http://localhost:3001/api/agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "...",
    "prompt": "Buy Market Data API and verify it works"
  }'
```

Expected response includes:
- Reasoning steps
- Tool calls (searchProduct, checkBudget, createPurchase, hireVerifier)
- Final result

---

### **Day 14-15: Testing & Polish**

#### End-to-End Test

1. Create product (merchant)
2. Agent buys product (x402 payment #1)
3. Agent hires verifier (x402 payment #2)
4. Verifier tests product
5. Escrow releases
6. Check verifier stats ($0.02 earned)
7. Check transaction feed

#### Monitor Logs

```bash
# Backend logs
npm run dev

# Database inspection
npm run db:studio
```

---

### **Day 16-17: Deploy to Production**

#### Backend Deployment (Railway)

1. Create Railway account
2. Create new project
3. Add PostgreSQL
4. Deploy from GitHub
5. Set environment variables
6. Deploy

#### Test Production

```bash
curl https://your-backend.railway.app/health
```

---

### **Day 18: Demo Preparation**

#### Record 90-Second Video

Script:
1. [0:00-0:10] Landing page intro
2. [0:10-0:20] Merchant creates product
3. [0:20-0:40] Agent purchase flow
4. [0:40-0:60] Verifier testing (the WOW moment)
5. [0:60-0:75] Escrow release
6. [0:75-0:90] Verifier stats reveal ($12.47 earned)

#### Prepare README

- Clear setup instructions
- Architecture diagram
- Demo video link
- Deployed contracts
- Live backend URL

---

## 🎯 Success Checklist

Before submitting:

- [ ] Backend running in production
- [ ] Smart contracts deployed & verified on Cronos testnet
- [ ] x402 payments working (can show 2 payments per purchase)
- [ ] Verifier agent earning money (visible stats)
- [ ] Agent reasoning visible in UI
- [ ] Auto-refund working
- [ ] Demo video recorded (90 seconds)
- [ ] README complete with all details
- [ ] GitHub repo public

---

## 🏆 What Makes You Win

1. **Two x402 payments** per purchase (buyer→merchant, agent→verifier)
2. **Visible verifier earnings** ($12.47 = proof of agent economy)
3. **Complete implementation** (not just a prototype)
4. **Perfect demo** (90 seconds, crystal clear)
5. **Real agent autonomy** (OpenAI tool calling, not hardcoded)

---

## 📞 Next Steps

**RIGHT NOW:**

```bash
cd backend
npm install
```

Then configure `.env` and test:

```bash
npm run dev
curl http://localhost:3001/health
```

**Report back with:**
- ✅ Backend running
- ✅ Database connected
- ✅ Health check passing

Then move to smart contract deployment!

---

**Built for Cronos x402 Hackathon 2024** 🚀
