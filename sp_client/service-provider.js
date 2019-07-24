const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const Blockchain = require("../blockchain");
const PubSub = require("../app/pubsub");
const TransactionPool = require("../wallet/transaction-pool");
const Cryptr = require("cryptr");

const app = express();

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const pubsub = new PubSub({ blockchain, transactionPool });

// Root node to fetch blockchain
const ROOT_NODE_ADDRESS = "http://localhost:3000";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "dist")));

// Array to store list of userkeys
let userKeys = [];

// =================================================================================
// API Routes
// =================================================================================

app.get("/api/updates", (req, res) => {
  let updates = [];
  userKeys.forEach(item => {
    let userTransactions = blockchain.fetchTransactions({
      chain: blockchain.chain,
      user: item.publicKey
    });
    for (let i = 0; i < userTransactions.length; i++) {
      if (
        item.timestamp < userTransactions[i].input.timestamp &&
        userTransactions[i].input.address === item.publicKey
      ) {
        const cryptr = new Cryptr(item.secretKey);
        updates.push({
          publicKey: userTransactions[i].input.address,
          secretKey: item.secretKey,
          decryptedData: cryptr.decrypt(
            userTransactions[i].outputMap[item.publicKey]
          )
        });
        break;
      }
    }
  });

  if (updates === undefined || updates.length === 0) {
    res.json({
      confirmation: "fail",
      message: "No updates found",
      updates
    });
  } else {
    res.json({
      confirmation: "success",
      message: "The chain has been updated",
      updates
    });
  }
});

app.get("/api/userlist", (req, res) => {
  if (userKeys === undefined || userKeys.length === 0) {
    res.json({
      confirmation: "fail",
      message: "No users have been saved",
      userList: userKeys
    });
  } else {
    let userTransactions = [];
    userKeys.forEach(item => {
      let txs = blockchain.fetchTransactions({
        chain: blockchain.chain,
        user: item.publicKey
      });
      console.log(txs);
      let latestTransaction = txs[txs.length - 1];
      const cryptr = new Cryptr(item.secretKey);
      userTransactions.push({
        publicKey: latestTransaction.input.address,
        secretKey: item.secretKey,
        timestamp: latestTransaction.input.timestamp,
        decryptedData: cryptr.decrypt(
          latestTransaction.outputMap[item.publicKey]
        )
      });
    });
    res.json({
      confirmation: "success",
      message: "User details retrieved successfully",
      userList: userTransactions
    });
  }
});

app.post("/api/updateList", (req, res) => {
  const { updates } = req.body;

  updates.map(update => {
    userKeys.forEach(user => {
      if (update.publicKey === user.publicKey) {
        user.timestamp = Date.now();
      }
    });
  });
  res.json({
    confirmation: "success",
    message: "User Data has been updated successfully!",
    updates: []
  });
});

app.post("/api/userKeys", (req, res) => {
  const { userPublicKey, userSecretKey } = req.body;

  let newUser = {
    publicKey: userPublicKey,
    secretKey: userSecretKey,
    timestamp: Date.now()
  };
  userKeys.push(newUser);

  console.log(userKeys);
  res.json({
    confirmation: "success",
    userKeys
  });
});

// serve index.html for all type of requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/service-provider.html"));
});

// =================================================================================
// Sync blockchain in new node
// =================================================================================
const syncWithRootState = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);

        console.log("replace chain on a sync with", rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );
};

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);

  syncWithRootState();
});
