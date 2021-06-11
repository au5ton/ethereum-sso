import detectEthereumProvider from '@metamask/detect-provider';
//import MetaMaskOnboarding from '@metamask/onboarding';
import { ethers } from 'ethers';
import { generateAffirmationMessage } from './CommonTools';

export async function getProvider(): Promise<ethers.providers.Web3Provider | null> {
  const provider = await detectEthereumProvider();
  if(provider) {
    return new ethers.providers.Web3Provider(provider as any);
  }
  else {
    return null;
  }
}

/** Bypass ethers wrap */
export const getRawProvider = async () => await detectEthereumProvider();

/**
 * Add an event listener to the raw provider
 * @param eventName 
 * @param listener 
 */
export function on(eventName: string | Array<string | Array<string>>, listener: (...args: Array<any>) => void) {
  getRawProvider().then(rawProvider => {
    (rawProvider as any).on(eventName, listener);
  });
}

/**
 * Remove an event listener to the raw provider
 * @param eventName 
 * @param listener 
 */
export function off(eventName: string | Array<string | Array<string>>, listener: (...args: Array<any>) => void) {
  getRawProvider().then(rawProvider => {
    (rawProvider as any).removeListener(eventName, listener);
  });
}

/**
 * Returns a boolean depending on if the connected wallet has granted any permissions yet
 */
export async function isWalletAccessGranted() {
  try {
    const provider = await getProvider();
    if(provider) {
      const response = await provider.send('wallet_getPermissions', []);
      return Array.isArray(response) && response.length > 0;
    }
  }
  catch(err) {
    return false;
  }
  return false;
}

/**
 * Formally requests the wallet for permission to see the public addresses
 */
export async function requestWalletConnection() {
  const provider = await getProvider();
  try {
    if(provider) {
      // trigger modal in MetaMask
      await provider.send('wallet_requestPermissions', [{ 'eth_accounts': {} }]);
      // get updated list of accounts
      return (await provider.listAccounts()).length > 0;
    }
  }
  catch(err) {
    return false;
  }
  return false;
}

/**
 * Returns the list of connected accounts, empty if no accounts are connected 
 */
export async function getConnectedAccounts() {
  try {
    const provider = await getProvider();
    if(provider) {
      return provider.listAccounts();
    }
    return [];
  }
  catch(err) {
    return [];
  }
}

/**
 * Signs a provided nonce with some other affirmation messaging to prevent replay attacks and other attacks
 * @param nonce
 */
export async function signNonce(nonce: string) {
  const provider = await getProvider();
  try {
    if(provider) {
      await provider.getNetwork();
      const signer = provider.getSigner();
      if(await isWalletAccessGranted()) {
        return await signer.signMessage(await generateAffirmationMessage(nonce, (await provider.listAccounts())[0], window.location.origin, provider.network.chainId));
      }
    }
  }
  catch(err) {
    return null;
  }
  return null;
}
