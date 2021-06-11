import fetchPonyfill from 'fetch-ponyfill';
const { fetch } = fetchPonyfill();

/**
 * Generates a string that looks like 1234-5678-9999... for the number of digits provided
 * @param digitLength 
 * @returns 
 * @deprecated
 */
export function generateNonce(digitLength: number = 16) {
  const segmentLength = 4;
  let str = Number(Math.floor(10e6 + Math.random() * digitLength * Math.pow(10,digitLength - 1))).toFixed().split('');
  
  let offset = 0;
  for(let start = segmentLength; start < (str.length - segmentLength); start += segmentLength) {
    str.splice(start + offset, 0, '-');
    offset++;
  }

  return str.join('');
}

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
`
