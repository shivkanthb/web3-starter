import Head from "next/head";
import styles from "../styles/Home.module.css";

import { useEffect, useState, useRef } from "react";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Web3Provider } from "@ethersproject/providers";
import useLocalStorage from "../hooks/useLocalStorage";
import { MetamaskIcon, WalletConnectIcon } from "../components/icons";

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
const wcConnector = new WalletConnectConnector({
  infuraId: "517bf3874a6848e58f99fa38ccf9fce4",
});

const ConnectorNames = {
  Injected: "injected",
  WalletConnect: "walletconnect",
};

const W3Operations = {
  Connect: "connect",
  Disconnect: "disconnect",
};

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  // library.pollingInterval = 12000;
  return library;
}

export default function WrapperHome() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Home />
    </Web3ReactProvider>
  );
}

function Home() {
  const web3React = useWeb3React();
  const { active, activate, error } = web3React;
  const [loaded, setLoaded] = useState(false);

  const [latestOp, setLatestOp] = useLocalStorage("latest_op", "");
  const [latestConnector, setLatestConnector] = useLocalStorage(
    "latest_connector",
    ""
  );
  // console.log(web3React);

  useEffect(() => {
    if (latestOp == "connect" && latestConnector == "injected") {
      injected
        .isAuthorized()
        .then((isAuthorized) => {
          setLoaded(true);
          if (isAuthorized && !web3React.active && !web3React.error) {
            web3React.activate(injected);
          }
        })
        .catch(() => {
          setLoaded(true);
        });
    } else if (latestOp == "connect" && latestConnector == "walletconnect") {
      console.log("Should be here");
      web3React.activate(wcConnector);
    }
  }, []);

  const getTruncatedAddress = (address) => {
    if (address && address.startsWith("0x")) {
      return address.substr(0, 4) + "..." + address.substr(address.length - 4);
    }
    return address;
  };

  const getNetwork = (chainId) => {
    switch (chainId) {
      case 1:
        return "Mainnet";
      case 3:
        return "Ropsten";

      case 4:
        return "Rinkeby";

      case 5:
        return "Goerli";

      case 42:
        return "Kovan";
      default:
        return `unknown network ${chainId}`;
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>web3 starter</title>
        <meta name="description" content="web3 starter nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!web3React.active ? (
        <div className="connect-wallet-container">
          <div className="connect-wallet-card">
            <div className="wallet-header">Connect your wallet</div>
            <div
              className="button metamask"
              onClick={() => {
                setLatestConnector(ConnectorNames.Injected);
                setLatestOp(W3Operations.Connect);
                web3React.activate(injected);
              }}
            >
              Metamask
              <MetamaskIcon />
            </div>
            <div
              className="button walletconnect"
              onClick={() => {
                setLatestConnector(ConnectorNames.WalletConnect);
                setLatestOp(W3Operations.Connect);
                web3React.activate(wcConnector);
              }}
            >
              WalletConnect
              <WalletConnectIcon />
            </div>
          </div>
        </div>
      ) : null}

      {web3React.active ? (
        <>
          <div className="connected-container">
            <div className="connected-card">
              <div className="row network-section">
                <div className="row-title">Network</div>
                <div className="row-subtitle">
                  {getNetwork(web3React.chainId)}
                </div>
              </div>
              <hr className="divider" />
              <div className="row network-section">
                <div className="row-title">Address</div>
                <div className="row-subtitle">
                  {getTruncatedAddress(web3React.account)}
                </div>
              </div>
              <hr className="divider" />
              <div
                className="row disconnect-button"
                onClick={() => {
                  setLatestOp(W3Operations.Disconnect);
                  web3React.deactivate();
                }}
              >
                Disconnect
              </div>
            </div>
          </div>
        </>
      ) : null}

      <style jsx>{`
        .connect-wallet-container {
          display: flex;
          width: 400px;
          height: 300px;
          border-radius: 30px;
          background: #ffffff;
          justify-content: center;
          align-items: center;
          text-align: center;
          box-shadow: rgb(0 0 0 / 10%) 0px 4px 20px;
        }
        .wallet-header {
          margin-bottom: 30px;
        }
        .button {
          width: 300px;
          height: 60px;
          background: #ffffff;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 25px;
          margin: 20px auto;
        }
        .button:hover {
          cursor: pointer;
        }

        .connected-container {
          display: flex;
          margin: 20px auto;
          width: 400px;
          border-radius: 30px;
          background: #ffffff;
          box-shadow: rgb(0 0 0 / 10%) 0px 4px 20px;
        }

        .row {
          display: flex;
          flex-direction: column;
          height: 80px;
          width: 400px;
          justify-content: center;
          padding: 0 20px;
        }

        .row-title {
          font-size: 16px;
          color: #afafaf;
          font-weight: 900;
        }
        .row-subtitle {
          font-size: 22px;
          font-weight: 700;
        }
        .disconnect-button {
          align-items: center;
          color: #f96666;
          font-size: 20px;
          font-weight: 900;
        }
        .disconnect-button:hover {
          cursor: pointer;
        }

        .divider {
          height: 0.1px;
          background-color: #e5e5e5;
          border: none;
          margin: unset;
        }
      `}</style>
    </div>
  );
}
