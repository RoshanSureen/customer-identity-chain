const Transaction = require("./transaction");
const randkey = require("random-keygen");
const { ec, cryptoHash } = require("../util");

class Wallet {
  constructor() {
    // Generate keys
    this.keyPair = ec.genKeyPair();

    // store public key in hex-form
    this.publicKey = this.keyPair.getPublic().encode("hex");

    this.secretKey = randkey.get({
      length: 10,
      numbers: true
    });
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  getSecretKey() {
    return this.secretKey;
  }

  createTransaction(userData) {
    return new Transaction({ senderWallet: this, userData });
  }

  static calculateBalance({ chain, address }) {
    let hasConductedTransaction = false;
    let outputsTotal = 0;

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      for (let transaction of block.data) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }
        const addressOutput = transaction.outputMap[address];
        if (addressOutput) {
          outputsTotal = outputsTotal + addressOutput;
        }
      }
      if (hasConductedTransaction) {
        break;
      }
    }

    return hasConductedTransaction
      ? outputsTotal
      : STARTING_BALANCE + outputsTotal;
  }
}

module.exports = Wallet;
