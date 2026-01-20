// Quick script to get wallet addresses from private keys
const { privateKeyToAccount } = require('viem/accounts');

const backendKey = '0x8bb70cf0e8ed4cdc7e721e590fb1e89f9561a0bbf10f7daf7282302ffdd02142';
const verifierKey = '0xdb65aad4c7aec443d22d3280474bb1782f9191ce937d8c65d764a24c68c54d6e';

const backendAccount = privateKeyToAccount(backendKey);
const verifierAccount = privateKeyToAccount(verifierKey);

console.log('\n🔑 YOUR WALLET ADDRESSES:\n');
console.log('Backend Wallet:  ', backendAccount.address);
console.log('Verifier Wallet: ', verifierAccount.address);
console.log('\n📝 NEXT STEPS:');
console.log('1. Visit: https://cronos.org/faucet');
console.log('2. Request tokens for BOTH addresses above');
console.log('3. Get TCRO (for gas) and devUSDC.e (for payments)');
console.log('\n');
