// Check if you have testnet tokens
const { createPublicClient, http } = require('viem');
const { cronosTestnet } = require('viem/chains');

const client = createPublicClient({
  chain: cronosTestnet,
  transport: http('https://evm-t3.cronos.org')
});

async function checkBalance() {
  const backend = '0x5A402854eec4c7e0Dd25cB87ca38632541A14322';
  const verifier = '0x769A2a2DfaDe17D787DCe0b033DFdc2f838f5DC2';
  
  console.log('\n🔍 Checking wallet balances...\n');
  
  const backendBalance = await client.getBalance({ address: backend });
  const verifierBalance = await client.getBalance({ address: verifier });
  
  const backendTCRO = Number(backendBalance) / 1e18;
  const verifierTCRO = Number(verifierBalance) / 1e18;
  
  console.log('Backend Wallet:  ', backend);
  console.log('Balance:         ', backendTCRO.toFixed(4), 'TCRO');
  console.log();
  console.log('Verifier Wallet: ', verifier);
  console.log('Balance:         ', verifierTCRO.toFixed(4), 'TCRO');
  console.log();
  
  if (backendTCRO >= 0.5) {
    console.log('✅ Backend wallet has enough TCRO for deployment!');
    console.log('✅ Ready to deploy smart contracts!');
    console.log('\nRun: cd contracts && npm install && npx hardhat run scripts/deploy.ts --network cronosTestnet');
  } else {
    console.log('⏳ Need testnet tokens...');
    console.log('\n📝 TO GET TOKENS:');
    console.log('1. Visit: https://cronos.org/faucet');
    console.log('2. Enter backend address: ' + backend);
    console.log('3. Request TCRO (for gas)');
    console.log('4. Wait 30 seconds and check again');
    console.log('\nOr try Discord faucet:');
    console.log('- Join: https://discord.com/invite/cronos');
    console.log('- #faucet channel: !faucet ' + backend);
  }
}

checkBalance().catch(console.error);
