import 'react-app-polyfill/ie11';
import * as React from 'react';
import { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';

import MetaMaskOnboarding from '@metamask/onboarding'
import { ethers } from 'ethers';

import { ClientTools } from '../.';

const App = () => {
  const [buttonText, setButtonText] = useState<string>('Connect');
  // const { data, error, isValidating } = useAtomFeed(sampleFeed);
  // console.log('sampleFeed: ', data);
  
  useEffect(() => {
    (async () => {
      console.log('effect');
      console.log('provider?', await ClientTools.getProvider());
      console.log('accounts?', await ClientTools.getConnectedAccounts());
    })();
  }, []);

  const connect = async () => {
    const provider = await ClientTools.getProvider();
    const res = await provider?.send('wallet_requestPermissions', [{ 'eth_accounts': {} }]);
    console.log(res);
  };

  const perms = async () => {
    const provider = await ClientTools.getProvider();
    const res = await provider?.send('wallet_getPermissions', []);
    console.log(res);
  };

  const sign = async () => {
    const sig = await ClientTools.signNonce('1234-5678-9999');
    console.log(sig);
    console.log(await Common.validateSignature('1234-5678-9999', '0xFa446Bf0A2c05365E27F15c712244d8b5A92585e', sig!));
  };

  return (
    <div>
      <h1>Hello, World!</h1>
      <button onClick={connect}>Connect</button>
      <button onClick={perms}>Get Permissions</button>
      <button onClick={sign}>Sign</button>
      {/* <OnboardingButton /> */}
      {/* <pre>
        {data !== undefined ? JSON.stringify(data, undefined, 2): ''}
      </pre> */}
    </div>
  );
};

export function OnboardingButton() {
  const ONBOARD_TEXT = 'Click here to install MetaMask!';
  const CONNECT_TEXT = 'Connect';
  const CONNECTED_TEXT = 'Connected';

  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef<MetaMaskOnboarding>();
  const ethereum = React.useRef<ethers.providers.Web3Provider>();
  

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
    (async () => {
      if (!ethereum.current) {
        ethereum.current = await ClientTools.getProvider() ?? undefined;
      }
    })();
  }, []);

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

  React.useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      // window.ethereum
      //   .request({ method: 'eth_requestAccounts' })
      //   .then(handleNewAccounts);
      ethereum.current?.on('accountsChanged', handleNewAccounts);
      return () => {
        ethereum.current?.off('accountsChanged', handleNewAccounts);
      };
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      ethereum.current?.send('eth_requestAccounts', [])
        .then((newAccounts) => setAccounts(newAccounts));
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