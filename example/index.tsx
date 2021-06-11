import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useAsync } from 'react-use';

import MetaMaskOnboarding from '@metamask/onboarding'
import { ClientTools } from '../.';

const App = () => {
  const accounts = useEthereumAccounts();

  return (
    <div>
      <h1>Hello, World!</h1>
      <p>Currently signed in accounts:</p>
      <pre>{JSON.stringify(accounts, null, 2)}</pre>
      <OnboardingButton />
    </div>
  );
};

export function useEthereum() {
  const { value: ethereum } = useAsync(async () => await ClientTools.getProvider());
  return ethereum ?? undefined;
}

/**
 * Sample React hook that responds to account changes
 * @returns 
 */
export function useEthereumAccounts() {
  const [accounts, setAccounts] = React.useState<string[]>([]);
  const ethereum = useEthereum();

  React.useEffect(() => {
    function handleAccountChange(newAccounts) {
      setAccounts([...newAccounts]);
    }
    if (ethereum) {
      ethereum
        .send('eth_accounts', [])
        .then(handleAccountChange);
      ClientTools.on('accountsChanged', handleAccountChange);
      return () => {
        ClientTools.off('accountsChanged', handleAccountChange);
      };
    }
  });

  return accounts;
}

/**
 * Sample React component that responds to account changes
 */
export function OnboardingButton() {
  const ONBOARD_TEXT = 'Click here to install MetaMask!';
  const CONNECT_TEXT = 'Connect';
  const CONNECTED_TEXT = 'Connected';

  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const ethereum = useEthereum();
  const accounts = useEthereumAccounts();
  const onboarding = React.useRef<MetaMaskOnboarding>();
  
  /**
   * Initialize library references
   */
  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  /**
   * Update button text when accounts state is updated
   */
  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current?.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  /**
   * Handle click
   */
  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled() && ethereum) {
      ClientTools.requestWalletConnection()
        .then(success => console.log(success ? 'wallet connected!' : 'connection failed'));
    } else {
      onboarding.current?.startOnboarding();
    }
  };
  return (
    <button disabled={isDisabled} onClick={onClick}>
      {buttonText}
    </button>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));