import fetchPonyfill from 'fetch-ponyfill';
import { ethers } from 'ethers'
const { fetch } = fetchPonyfill();

/**
 * Get the name of a particular chain based on its chainId, data sourced from: https://chainid.network
 * @param chainId 
 * @returns 
 */
export async function getChainName(chainId: number) {
  const res = await fetch('https://chainid.network/chains_mini.json');
  const data: { name: string, chainId: number }[] = await res.json();
  return data.find(e => e.chainId === chainId)?.name;
}

export const generateAffirmationMessage = async (nonce: string, walletAddress: string, domain: string, chainId: number) => `
I hereby claim:

  * I am the owner of the Ethereum wallet with address ${walletAddress.toLocaleLowerCase()}
  * This claim may be used for the purposes of authentication at: ${domain.toLocaleLowerCase()}
  * On the chain: ${await getChainName(chainId)} (chainId = ${chainId})

To do so, I am signing this nonce: ${nonce}
`;

/**
 * Resolves an ENS name to an address
 * @param provider 
 * @param name 
 * @returns 
 */
export const resolveName = async (provider: ethers.providers.BaseProvider, name: string) => await (await provider.resolveName(name)).toLocaleLowerCase();

/**
 * Resolves an address to an ENS name
 * @param provider 
 * @param address 
 * @returns 
 */
export const lookupAddress = async (provider: ethers.providers.BaseProvider, address: string) => await (await provider.lookupAddress(address)).toLocaleLowerCase();

/**
 * Validates that the ENS name and address resolve to each other.
 * @param provider 
 * @param name 
 * @param address 
 * @returns 
 */
export const validateNameAddressPair = async (provider: ethers.providers.BaseProvider, name: string, address: string) => 
  (await lookupAddress(provider, address)) === name &&
  (await resolveName(provider, name)) === address;
