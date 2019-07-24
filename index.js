const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const apiRouter = require("./routes/api");
const {
  blockchain,
  transactionPool,
  walletFoo,
  cryptrFoo,
  walletBar,
  cryptrBar,
  wallet,
  cryptr,
  transactionMiner
} = require("./initilizer");

const app = express();

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "client/dist")));

// serve index.html for all type of requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

// =================================================================================
// Sync blockchain and transactionPool in new node
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

  request(
    { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootTransactionPoolMap = JSON.parse(body);

        console.log(
          "replace transaction pool map on a sync with",
          rootTransactionPoolMap
        );
        transactionPool.setMap(rootTransactionPoolMap);
      }
    }
  );
};

// =================================================================================
// make some transactions for testing
// =================================================================================

if (!process.env.GENERATE_PEER_PORT) {
  const generateWalletTransaction = ({ wallet, encryptedData }) => {
    const transaction = wallet.createTransaction(encryptedData);

    transactionPool.setTransaction(transaction);
  };

  const walletAction = () =>
    generateWalletTransaction({
      wallet,
      encryptedData: cryptr.encrypt(
        JSON.stringify({
          "First Name": "Roshan",
          "Last Name": "Sureen",
          Address: "Zimmermanstrasse 14",
          "Postal-Code": "37077",
          City: "Goettingen"
        })
      )
    });

  const walletFooAction = () =>
    generateWalletTransaction({
      wallet: walletFoo,
      encryptedData: cryptrFoo.encrypt(
        JSON.stringify({
          "First Name": "Rishabh",
          "Last Name": "Stark",
          Address: "Albrecht Thaer Weg 12",
          "Postal-Code": "37075",
          City: "Goettingen"
        })
      )
    });

  const walletBarAction = () =>
    generateWalletTransaction({
      wallet: walletBar,
      encryptedData: cryptrBar.encrypt(
        JSON.stringify({
          "First Name": "Grigor",
          "Last Name": "Davtyan",
          Address: "Annastrasse 4",
          "Postal-Code": "37075",
          City: "Goettingen"
        })
      )
    });

  for (let i = 0; i < 3; i++) {
    if (i === 0) {
      walletAction();
    } else if (i === 1) {
      walletFooAction();
    } else {
      walletBarAction();
    }

    transactionMiner.mineTransactions();
  }
}

// =================================================================================

// generate different port number for different nodes in the network
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});
