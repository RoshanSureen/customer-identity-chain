const Block = require("./block");
const Wallet = require("../wallet");
const { cryptoHash } = require("../util");
const { REWARD_INPUT, MINING_REWARD } = require("../config");
const Transaction = require("../wallet/transaction");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data
    });
    this.chain.push(newBlock);
  }

  // fetch a transaction based on its ID
  fetchTransaction({ chain, id, user }) {
    let TransactionFound = false;
    let transaction = {};
    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      for (let tx of block.data) {
        if (tx.id === id && tx.input.address === user) {
          TransactionFound = true;
          transaction = tx;
        }
      }
      if (TransactionFound) {
        break;
      }
    }

    return transaction;
  }

  // fetch all transactions of a user
  fetchTransactions({ chain, user }) {
    let transactions = [];
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];

      for (let tx of block.data) {
        if (tx.input.address === user) {
          transactions.push(tx);
        }
      }
    }
    return transactions;
  }

  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];

      // collection of unique transactions
      const transactionSet = new Set();

      for (let transaction of block.data) {
        // check validity of regular transaction
        if (!Transaction.validTransaction(transaction)) {
          console.error("Invalid transaction");
          return false;
        }

        // check for identical transactions
        if (transactionSet.has(transaction)) {
          console.error(
            "An identical transaction appears more than once in the block"
          );
          return false;
        } else {
          transactionSet.add(transaction);
        }
      }
    }
    return true;
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];
      const actualLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (lastHash !== actualLastHash) return false;

      const validateHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== validateHash) return false;

      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }

  // sets the blockchain to the longest chain in the network
  replaceChain(chain, validateTransactions, onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    if (validateTransactions && !this.validTransactionData({ chain })) {
      console.error("The incoming chain has invalid data");
      return;
    }

    if (onSuccess) onSuccess();
    console.log("replacing chain with", chain);
    this.chain = chain;
  }
}

module.exports = Blockchain;
