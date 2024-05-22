import sha256 from 'crypto-js/sha256';

export async function getTransactionId(str) {
  const hashedStr = sha256(str).toString();

  return hashedStr.toUpperCase().slice(0, 11);
}
