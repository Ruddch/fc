// Whitelist addresses for alpha testing
// Addresses should be in lowercase for correct comparison
export const WHITELIST_ADDRESSES: string[] = [
    "0xfD0634a7cC9288B52C2a7377dbf1efA5f3212ec6",
  // Add wallet addresses to whitelist here
  // Example: "0x1234567890123456789012345678901234567890",
];

/**
 * Checks if an address is in the whitelist
 * @param address - Wallet address to check
 * @returns true if address is in whitelist, false otherwise
 */
export function isAddressWhitelisted(address: string | undefined): boolean {
  if (!address) return false;
  
  // Convert address to lowercase for comparison
  const normalizedAddress = address.toLowerCase();
  return WHITELIST_ADDRESSES.some(
    (whitelistedAddress) => whitelistedAddress.toLowerCase() === normalizedAddress
  );
}

