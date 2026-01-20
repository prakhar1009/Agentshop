# 📋 Credentials Checklist - AgentShop

**Track what you need and where to get it**

---

## ✅ Required Credentials

### 1️⃣ Cronos Testnet Wallet

| Item | Status | Where to Get |
|------|--------|--------------|
| **Wallet Address** | ⬜ | MetaMask → Account Details |
| **Private Key (Backend)** | ⬜ | MetaMask → Export Private Key |
| **Private Key (Verifier)** | ⬜ | Create 2nd wallet, export key |
| **Test TCRO** | ⬜ | https://cronos.org/faucet |
| **Test USDC.e** | ⬜ | https://cronos.org/faucet |

**How to get:**
1. Install MetaMask extension
2. Create wallet or import existing
3. Add Cronos Testnet network (Chain ID: 338)
4. Export private key from Account Details
5. Visit faucet for test tokens

**Use in `.env`:**
```env
BACKEND_PRIVATE_KEY=0x...
VERIFIER_PRIVATE_KEY=0x...
```

---

### 2️⃣ OpenAI API Key

| Item | Status | Where to Get |
|------|--------|--------------|
| **API Key** | ⬜ | https://platform.openai.com/api-keys |

**How to get:**
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy key (starts with `sk-...`)

**Cost:** ~$0.01-0.05 per agent execution

**Use in `.env`:**
```env
OPENAI_API_KEY=sk-...
```

---

### 3️⃣ Database (PostgreSQL)

| Item | Status | Where to Get |
|------|--------|--------------|
| **Database URL** | ⬜ | Railway.app or local PostgreSQL |

**How to get:**

**Option A - Railway (Production):**
1. Visit https://railway.app
2. Sign up with GitHub
3. New Project → Provision PostgreSQL
4. Copy DATABASE_URL from Variables tab

**Option B - Local (Testing):**
```bash
brew install postgresql@14
brew services start postgresql@14
createdb agentshop
# URL: postgresql://localhost:5432/agentshop
```

**Use in `.env`:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

### 4️⃣ Security Keys

| Item | Status | How to Generate |
|------|--------|-----------------|
| **JWT Secret** | ⬜ | `openssl rand -base64 32` |
| **Encryption Key** | ⬜ | `openssl rand -base64 32` |

**How to generate:**
```bash
# Terminal commands (run each separately)
openssl rand -base64 32  # Copy output for JWT_SECRET
openssl rand -base64 32  # Copy output for ENCRYPTION_KEY
```

**Use in `.env`:**
```env
JWT_SECRET=... # 32+ chars
ENCRYPTION_KEY=... # 32+ chars
```

---

### 5️⃣ Smart Contract Addresses

| Item | Status | How to Get |
|------|--------|------------|
| **ProductRegistry** | ⬜ | Deploy with Hardhat (Step 5) |
| **EscrowVault** | ⬜ | Deploy with Hardhat (Step 5) |
| **ReceiptRegistry** | ⬜ | Deploy with Hardhat (Step 5) |

**How to get:**
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network cronosTestnet
# Copy 3 addresses from output
```

**Use in `.env`:**
```env
PRODUCT_REGISTRY_ADDRESS=0x...
ESCROW_VAULT_ADDRESS=0x...
RECEIPT_REGISTRY_ADDRESS=0x...
```

---

## ✅ NO API KEYS NEEDED (Already Configured)

| Item | Status | Value |
|------|--------|-------|
| **x402 Facilitator URL** | ✅ Done | `https://facilitator.cronoslabs.org/v2/x402` |
| **USDC Token Address** | ✅ Done | `0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0` |
| **Cronos RPC URL** | ✅ Done | `https://evm-t3.cronos.org` |
| **Chain ID** | ✅ Done | `338` |

These are pre-configured in `.env.example` - just copy to `.env`

**No Discord requests needed!**
**No special API keys!**
**No approvals required!**

---

## 📝 Progress Tracker

### Checklist

- [ ] Step 1: Created Cronos testnet wallet
- [ ] Step 2: Exported private key (backend)
- [ ] Step 3: Created 2nd wallet for verifier
- [ ] Step 4: Got test TCRO from faucet
- [ ] Step 5: Got test USDC.e from faucet
- [ ] Step 6: Created OpenAI account
- [ ] Step 7: Generated OpenAI API key
- [ ] Step 8: Setup Railway PostgreSQL
- [ ] Step 9: Copied DATABASE_URL
- [ ] Step 10: Generated JWT secret
- [ ] Step 11: Generated encryption key
- [ ] Step 12: Created `.env` file
- [ ] Step 13: Filled all `.env` values
- [ ] Step 14: Ran `npm install`
- [ ] Step 15: Ran `npm run db:generate`
- [ ] Step 16: Ran `npm run db:push`
- [ ] Step 17: Deployed smart contracts
- [ ] Step 18: Added contract addresses to `.env`
- [ ] Step 19: Started backend (`npm run dev`)
- [ ] Step 20: Tested health endpoint

---

## 🎯 Quick Reference

**Essential URLs:**
- Cronos Faucet: https://cronos.org/faucet
- OpenAI Keys: https://platform.openai.com/api-keys
- Railway: https://railway.app
- Cronos Explorer: https://explorer.cronos.org/testnet

**Essential Commands:**
```bash
# Install dependencies
npm install

# Generate security keys
openssl rand -base64 32

# Initialize database
npm run db:generate && npm run db:push

# Deploy contracts
cd contracts && npx hardhat run scripts/deploy.ts --network cronosTestnet

# Start backend
npm run dev
```

---

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| Cronos Testnet Tokens | FREE |
| OpenAI (first usage) | ~$5 credit free |
| Railway PostgreSQL | FREE tier available |
| x402 Facilitator | FREE (no API key!) |
| Smart Contract Deployment | FREE (testnet) |
| **Total** | **$0-5** |

---

**Last Updated:** Jan 9, 2026  
**Time to Complete:** ~15 minutes  
**Difficulty:** Beginner-friendly ✅
