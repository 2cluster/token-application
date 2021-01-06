import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import ABI from "../contract/abi.json";
import ADR from "../contract/adr.json";
import ACC from "../contract/acc.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Transfer } from "./Transfer";
import { TransferFrom } from "./TransferFrom";
import { Allowance } from "./Allowance";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { NoTokensMessage } from "./NoTokensMessage";
import { Contract } from "./Contract";


const ERROR_CODE_TX_REJECTED_BY_USER = 4001;


export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      tokenData: undefined,
      total: undefined,
      selectedAddress: undefined,
      selectedName: undefined,
      balance: undefined,
      allowance: undefined,
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      accountError: undefined,
    };

    this.state = this.initialState;

  }



  render() {

    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }


    if (this.state.networkError) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    if (this.state.accountError ||
      this.state.accounts === undefined ||
      ((this.state.selectedAddress !== this.state.accounts.controller.toLowerCase()) && (this.state.selectedAddress !== this.state.accounts.party1.toLowerCase()) && (this.state.selectedAddress !== this.state.accounts.party2.toLowerCase()))) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.accountError}
          dismiss={() => this._dismissAccountError()}
        />
      );
    }

    if (!this.state.tokenData || !this.state.accounts) {
      return <Loading />;
    }
    console.log(this.state)
    if (this.state.selectedName === "controller") {
      return (
        <div className="">
          <div className="row">
            <Contract tokenData={this.state.tokenData} />
          </div>


          <div className="container">

          <h2>Controllers Account</h2>

            <div className="row">
              <div className="col-6 p-3 card">
                <h2>Party1</h2>
                <p>
                  Balance:  <b>$ {(Math.round(this.state.p1balance * this.state.tokenData.decimals ** 10) / (this.state.tokenData.decimals ** 10)).toFixed(this.state.tokenData.decimals).toString()}</b>
                </p>
                <p>
                  Allowed:  <b>$ {(Math.round(this.state.p1allowance * this.state.tokenData.decimals ** 10) / (this.state.tokenData.decimals ** 10)).toFixed(this.state.tokenData.decimals).toString()}</b>
                </p>
              </div>
              <div className="col-6 p-3 card">
                <h2>Party2</h2>
                <p>
                  Balance:  <b>$ {(Math.round(this.state.p2balance * this.state.tokenData.decimals ** 10) / (this.state.tokenData.decimals ** 10)).toFixed(this.state.tokenData.decimals).toString()}</b>
                </p>
                <p>
                  Allowed:  <b>$ {(Math.round(this.state.p2allowance * this.state.tokenData.decimals ** 10) / (this.state.tokenData.decimals ** 10)).toFixed(this.state.tokenData.decimals).toString()}</b>
                </p>
              </div>
            </div>
            <div>
              {this.state.txBeingSent && (<WaitingForTransactionMessage txHash={this.state.txBeingSent} />)}
              {this.state.transactionError && (
                <TransactionErrorMessage
                  message={this._getRpcErrorMessage(this.state.transactionError)}
                  dismiss={() => this._dismissTransactionError()}
                />)}

            </div>


          <div className="row mt-10">
            <div className="col-6 card">
              {this.state.balance.eq(0) && (
                <NoTokensMessage selectedAddress={this.state.selectedAddress} />
              )}
              {this.state.balance.gt(0) && (
                <Transfer
                  transferTokens={(to, amount) =>
                    this._transferTokens(to, amount)
                  }
                  tokenSymbol={this.state.tokenData.symbol}
                  accounts={this.state.accounts}
                />
              )}
            </div>
            <div className="col-6 card">
              {this.state.balance.eq(0) && (
                <NoTokensMessage selectedAddress={this.state.selectedAddress} />
              )}
              {this.state.balance.gt(0) && (
                <TransferFrom
                transferFromTokens={(from, to, amount) =>
                    this._transferFromTokens(from, to, amount)
                  }
                  tokenSymbol={this.state.tokenData.symbol}
                  accounts={this.state.accounts}
                />
              )}
            </div>
          </div>
          </div>
        </div>
      );


    } else if (this.state.selectedName === "party1" || this.state.selectedName === "party2") {
      return (
        <div className="">
          <div className="row">
            <Contract tokenData={this.state.tokenData} />
          </div>


          <div className="container">
            <div className="row">
              <h1>{this.state.selectedName}</h1>
              </div>
              <div className="row card">
                <div className="col-6">
                  <p>Balance:</p>
                  <p>Approved amount:</p>
                </div>
                <div className="col-6">
                  <p><b>$ {(Math.round(this.state.balance * this.state.tokenData.decimals ** 10) / (this.state.tokenData.decimals ** 10)).toFixed(this.state.tokenData.decimals).toString()}</b></p>
                  <p><b>$ {(Math.round(this.state.allowance * this.state.tokenData.decimals ** 10) / (this.state.tokenData.decimals ** 10)).toFixed(this.state.tokenData.decimals).toString()}</b></p>
                </div>
              </div>

              <div>

                {this.state.txBeingSent && (<WaitingForTransactionMessage txHash={this.state.txBeingSent} />)}

                {this.state.transactionError && (
                  <TransactionErrorMessage
                    message={this._getRpcErrorMessage(this.state.transactionError)}
                    dismiss={() => this._dismissTransactionError()}
                  />)}
              </div>
            <div className="row card">
              <div className="col-4">

                {this.state.balance.eq(0) && (
                  <NoTokensMessage selectedAddress={this.state.selectedAddress} />
                )}

                {this.state.balance.gt(0) && (
                  <Allowance
                    approve={(amount) =>
                      this._setAllowance(amount)
                    }
                    tokenSymbol={this.state.tokenData.symbol}
                  />
                )}
              </div>
              <div className="row">
                <div className="col-4">

                  {this.state.balance.eq(0)}


                </div>
              </div>
            </div>
          </div>
        </div>
      );

    }
  }


  componentWillUnmount() {

    this._stopPollingData();
  }

  async _connectWallet() {

    const [selectedAddress] = await window.ethereum.enable();

    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress)

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      this._resetState();

      this._initialize(newAddress);

      return
    });

    window.ethereum.on("networkChanged", ([networkId]) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  async _initialize(userAddress) {

    let accounts = ACC.accounts
    let wallet = {}
    let selectedName = undefined
    await Object.keys(accounts).forEach(key => {
      if (userAddress.toLowerCase() === key.toLowerCase()) {
        selectedName = accounts[key]
        wallet[accounts[key]] = key
      } else {
        wallet[accounts[key]] = key
      }
    });

    await this.setState({
      accounts: wallet,
      selectedName: selectedName,
      selectedAddress: userAddress,
    });

    if (selectedName === undefined) {
      this.setState({
        accountError: 'Please use one of the first 5 accounts provided by the mnemonic in .env '
      });
      return false
    }

    this._intializeEthers();
    this._getTokenData();
    this._startPollingData();

    return true
  }

  async _intializeEthers() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    this._token = new ethers.Contract(
      ADR.contract,
      ABI.abi,
      this._provider.getSigner(0)
    );


  }

  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateAccount(), 1000);

    this._updateAccount();

  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  async _getTokenData() {
    const name = await this._token.name();
    const symbol = await this._token.symbol();
    const decimals = await this._token.decimals();
    const total = await this._token.totalSupply();
    const address = await this._token.address;

    this.setState({ tokenData: { name, symbol, decimals, total, address } });
  }

  async _updateAccount() {

    if (this.state.selectedAddress !== this.state.accounts.controller.toLowerCase()) {
      let balance = await this._token.balanceOf(this.state.selectedAddress);
      let allowance = await this._token.allowance(this.state.selectedAddress, this.state.accounts.controller);

      await this.setState({ balance, allowance });

    } else {

      let balance = await this._token.balanceOf(this.state.selectedAddress);

      await this.setState({ balance });

      let p1balance = await this._token.balanceOf(this.state.accounts.party1);
      let p1allowance = await this._token.allowance(this.state.accounts.party1, this.state.accounts.controller);

      await this.setState({ p1balance, p1allowance });

      let p2balance = await this._token.balanceOf(this.state.accounts.party2);
      let p2allowance = await this._token.allowance(this.state.accounts.party2, this.state.accounts.controller);

      await this.setState({ p2balance, p2allowance });
    }




  }

  async _transferTokens(to, amount) {
    try {

      this._dismissTransactionError();

      const tx = await this._token.transfer(to, amount);
      this.setState({ txBeingSent: tx.hash });

      const receipt = await tx.wait();

      if (receipt.status === 0) {

        throw new Error("Transaction failed");
      }

      await this._updateAccount();
    } catch (error) {
      // REJECTED TX BY USER
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);
      this.setState({ transactionError: error });
    } finally {

      this.setState({ txBeingSent: undefined });
    }
  }

  async _transferFromTokens(from, to, amount) {
    try {

      this._dismissTransactionError();


      const tx = await this._token.transferFrom(from, to, amount);
      this.setState({ txBeingSent: tx.hash });

      const receipt = await tx.wait();

      if (receipt.status === 0) {

        throw new Error("Transaction failed");
      }

      await this._updateAccount();
    } catch (error) {
      // REJECTED TX BY USER
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      this.setState({ transactionError: error });
    } finally {

      this.setState({ txBeingSent: undefined });
    }
  }

  async _setAllowance(amount) {

    try {

      this._dismissTransactionError();

      const tx2 = await this._token.approve(this.state.accounts.controller, amount);
      this.setState({ txBeingSent: tx2.hash });

      const receipt = await tx2.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      await this._updateAccount();
    } catch (error) {
      // REJECTED TX BY USER
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);
      this.setState({ transactionError: error });
    } finally {

      this.setState({ txBeingSent: undefined });
    }
  }

  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  _dismissAccountError() {
    this.setState({ accountError: undefined });
    return;
  }

  _getRpcErrorMessage(error) {
    let err = error

    return err.error.message;
  }

  _resetState() {
    this.setState(this.initialState);
  }

  _checkNetwork() {
    let network = ADR.network

    if (window.ethereum.networkVersion !== ADR.networkId) {
      this.setState({
        networkError: `Please connect Metamask to network: ${network}`
      });

      return false;
    }
    return true
  }

  _checkAccounts() {

    if (this.state.accounts === undefined ||
      ((this.state.selectedAddress !== this.state.accounts.controller.toLowerCase()) && (this.state.selectedAddress !== this.state.accounts.party1.toLowerCase()) && (this.state.selectedAddress !== this.state.accounts.party2.toLowerCase()))) {
      this.setState({
        accountError: 'Please use one of the first accounts provided by the mnemonic in .env '
      });
      return false
    }

    return true;
  }
}
