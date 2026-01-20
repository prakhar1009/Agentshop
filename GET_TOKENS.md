# 🪙 Get FREE Testnet Tokens

## Your Wallet Addresses:

**Backend Wallet:**
```
0x5A402854eec4c7e0Dd25cB87ca38632541A14322
```

**Verifier Wallet:**
```
0x769A2a2DfaDe17D787DCe0b033DFdc2f838f5DC2
```

---

## Option 1: Cronos Faucet (Official - Recommended)

1. Visit: **https://cronos.org/faucet**
2. Enter: `0x5A402854eec4c7e0Dd25cB87ca38632541A14322`
3. Request **TCRO** (for gas fees)
4. Wait 30 seconds
5. Request **devUSDC.e** (for testing payments)
6. Repeat for verifier: `0x769A2a2DfaDe17D787DCe0b033DFdc2f838f5DC2`

---

## Option 2: Alternative Faucets

If the official faucet has issues, try these:

**Chainlist Faucet:**
- https://chainlist.org/chain/338
- Connect wallet and request testnet tokens

**Cronos Discord:**
- Join: https://discord.com/invite/cronos
- Go to #faucet channel
- Use bot command: `!faucet 0x5A402854eec4c7e0Dd25cB87ca38632541A14322`

---

## How to Check Your Balance

Run this command to verify tokens arrived:
```bash
cd /Users/prakharmishra/Desktop/AgentShop/backend
node -e "
const { createPublicClient, http } = require('viem');
const { cronosTestnet } = require('viem/chains');

const client = createPublicClient({
  chain: cronosTestnet,
  transport: http('https://evm-t3.cronos.org')
});

async function checkBalance() {
  const backend = '0x5A402854eec4c7e0Dd25cB87ca38632541A14322';
  const verifier = '0x769A2a2DfaDe17D787DCe0b033DFdc2f838f5DC2';
  
  const backendBalance = await client.getBalance({ address: backend });
  const verifierBalance = await client.getBalance({ address: verifier });
  
  console.log('Backend TCRO:', (Number(backendBalance) / 1e18).toFixed(4));
  console.log('Verifier TCRO:', (Number(verifierBalance) / 1e18).toFixed(4));
  
  if (Number(backendBalance) > 0) {
    console.log('✅ Ready to deploy contracts!');
  } else {
    console.log('⏳ Waiting for tokens...');
  }
}

checkBalance();
"
```

---

## What You Need:

- **TCRO**: At least 1 TCRO per wallet (for gas fees)
- **devUSDC.e**: At least 1 USDC.e for testing (optional for deployment)

---

**After you get tokens, come back and I'll deploy the contracts!**
