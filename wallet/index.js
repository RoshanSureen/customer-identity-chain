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
}

module.exports = Wallet;
