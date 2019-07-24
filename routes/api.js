const express = require("express");
const router = express.Router();
const {
  blockchain,
  wallet,
  cryptr,
  transactionPool,
  pubsub,
  transactionMiner
} = require("../initilizer");

// fetch all blocks in the blockchain
router.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

router.post("/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });

  pubsub.broadcastChain();
  res.redirect("/api/blocks");
});

// fetch transaction history of user
router.get("/transactions", (req, res) => {
  let transactions = blockchain.fetchTransactions({
    chain: blockchain.chain,
    user: wallet.publicKey
  });

  if (transactions === undefined || transactions.length === 0) {
    res.json({
      confirmation: "fail",
      message: "You did not make any transactions",
      transactions
    });
  } else {
    let userTransactions = [];

    transactions.forEach(tx => {
      userTransactions.push({
        txId: tx.id,
        publicKey: tx.input.address,
        timestamp: tx.input.timestamp,
        decryptedData: cryptr.decrypt(tx.outputMap[wallet.publicKey])
      });
    });
    res.json({
      confirmation: "success",
      message: "Your Transaction History",
      transactions: userTransactions
    });
  }
});

// create a transaction
router.post("/transact", (req, res) => {
  const { userData } = req.body;
  const encryptedUserData = cryptr.encrypt(JSON.stringify(userData));

  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey
  });
  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, encryptedUserData });
    } else {
      transaction = wallet.createTransaction(encryptedUserData);
    }
  } catch (error) {
    return res.status(400).json({
      confirmation: "fail",
      message: error.message
    });
  }
  transactionPool.setTransaction(transaction);

  res.json({
    confirmation: "success",
    transaction
  });

  pubsub.broadcastTransaction(transaction);
});

// fetch transactions in the transactions pool
router.get("/transaction-pool-map", (req, res) => {
  res.json(transactionPool.transactionMap);
});

// mine transactions
router.get("/mine-transactions", (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect("/api/blocks");
});

// fetch user wallet info
router.get("/wallet-info", (req, res) => {
  const address = wallet.publicKey;
  const secretKey = wallet.getSecretKey();
  res.json({
    address,
    secretKey
  });
});

module.exports = router;
