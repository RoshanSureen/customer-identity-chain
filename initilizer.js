const Blockchain = require("./blockchain");
const PubSub = require("./app/pubsub");
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet");
const TransactionMiner = require("./app/transaction-miner");
const Cryptr = require("cryptr");

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const userSecretKey = wallet.getSecretKey();
const cryptr = new Cryptr(userSecretKey);
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub
});

// =================================================================================
// wallets for testing
// =================================================================================
const walletFoo = new Wallet();
const fooSecretKey = walletFoo.getSecretKey();
const cryptrFoo = new Cryptr(fooSecretKey);
const walletBar = new Wallet();
const BarSecretKey = walletBar.getSecretKey();
const cryptrBar = new Cryptr(BarSecretKey);
// =================================================================================

module.exports = {
  blockchain,
  transactionPool,
  wallet,
  cryptr,
  pubsub,
  transactionMiner,
  walletFoo,
  cryptrFoo,
  walletBar,
  cryptrBar
};
