import React, { Component } from "react";

const Transaction = ({ transaction }) => {
  const { input, outputMap } = transaction;
  const recipients = Object.keys(outputMap);
  console.log(transaction);
  return (
    <div className="Transaction">
      <div>From: {`${input.address.substring(0, 35)}...`}</div>
      {recipients.map(recipient => (
        <div key={recipient}>
          <br />
          UserData: {outputMap[recipient]}
        </div>
      ))}
    </div>
  );
};

export default Transaction;
