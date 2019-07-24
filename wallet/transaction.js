const uuid = require("uuid/v1");
const { verifySignature } = require("../util");

class Transaction {
  constructor({ senderWallet, userData }) {
    this.id = uuid();
    this.outputMap = this.createOutputMap({ senderWallet, userData });
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  createOutputMap({ senderWallet, userData }) {
    const outputMap = {};

    outputMap[senderWallet.publicKey] = userData;
    return outputMap;
  }

  createInput({ senderWallet, outputMap }) {
    return {
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap)
    };
  }

  // update amount to recipient or add a new recipient in transaction
  update({ senderWallet, userData }) {
    this.outputMap[recipient] = userData;

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  static validTransaction(transaction) {
    const {
      input: { address, signature },
      outputMap
    } = transaction;

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;
  }
}

module.exports = Transaction;
