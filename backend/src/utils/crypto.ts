import CryptoJS from 'crypto-js';
import { createHash } from 'crypto';
import config from '../config';

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, config.ENCRYPTION_KEY).toString();
};

export const decrypt = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, config.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const hashData = (data: string): string => {
  return createHash('sha256').update(data).digest('hex');
};

export const keccak256Hash = (data: string): string => {
  return '0x' + CryptoJS.SHA3(data, { outputLength: 256 }).toString();
};

export const generateProofHash = (proof: any): string => {
  const proofString = JSON.stringify(proof);
  return keccak256Hash(proofString);
};

export const truncateAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const parseUSDC = (amount: string): bigint => {
  const decimals = 6;
  const parts = amount.split('.');
  const whole = parts[0] || '0';
  const fraction = (parts[1] || '').padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + fraction);
};

export const formatUSDC = (amount: bigint | string): string => {
  const decimals = 6;
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** decimals);
  const whole = amountBigInt / divisor;
  const fraction = amountBigInt % divisor;
  return `${whole}.${fraction.toString().padStart(decimals, '0')}`;
};
