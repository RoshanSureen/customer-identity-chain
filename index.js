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
          fullName: "Roshan Sureen",
          street: "Zimmermanstrasse 14",
          dob: "29/07/1995",
          city: "Goettingen",
          postcode: "37077",
          id: "DFGHJKJHGE456"
        })
      )
    });

  const walletFooAction = () =>
    generateWalletTransaction({
      wallet: walletFoo,
      encryptedData: cryptrFoo.encrypt(
        JSON.stringify({
          fullName: "John Doe",
          street: "Robert Koch Strasse 04",
          dob: "01/04/1990",
          city: "Goettingen",
          postcode: "37075",
          id: "WERTMNBV456"
        })
      )
    });

  const walletBarAction = () =>
    generateWalletTransaction({
      wallet: walletBar,
      encryptedData: cryptrBar.encrypt(
        JSON.stringify({
          fullName: "Maria Phoneix",
          street: "Christophurusweg 33",
          dob: "22/06/1997",
          city: "Goettingen",
          postcode: "37075",
          id: "SERTYUILKNBV456"
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
