import sha256 from 'crypto-js/sha256';

export async function getUniqueId(str) {
  const hashedStr = sha256(str).toString();

  return hashedStr.slice(0, 24);
}

export function createTransactionId(str) {
  return str.slice(0, 11);
}
