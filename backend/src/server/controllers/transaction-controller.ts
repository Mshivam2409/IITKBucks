import { JSONTransactions, transactionData, JSONTransaction, unusedOutputs, unusedOutput } from "../../classes/interfaces";
import * as fs from "fs"
import Transaction from "../../classes/transaction";
import Output from "../../classes/output"
import encryptOutput from "../../functions/encryptOutput";
import Axios from "axios";
import hexfromBuffer from "../../generators/hexString";

const getPendingTransactions = async (req: any, res: any, nex: any) => {
  res.set("Content-Type", "application/json");
  const pendingTransactions: JSONTransactions = require("../../data/pendingTransactions.json");
  var data: Array<any> = [];
  for (const key in pendingTransactions) {
    data.push(pendingTransactions[key]);
  }
  res.status(200).json(data);
};

const newTransaction = async (req: any, res: any, next: any) => {
  var pendingTransactions = require("../../data/pendingTransactions.json");
  const newTransaction = new Transaction(
    req.body.inputs.length,
    req.body.outputs.length
  );
  await newTransaction.createTransactionfromJSON(req.body);
  pendingTransactions[newTransaction.transactionId] = req.body;
  console.log(`New Transaction Added!`)
  fs.writeFileSync(
    "./src/data/pendingTransactions.json",
    JSON.stringify(pendingTransactions),
    "utf8",
  );
  res.status(201).json({ message: "Transcation Added" });
};

const processTransaction = async (req: any, res: any, next: any) => {
  const aliases = require("../../data/aliases.json");
  console.log("Transaction Request Received\nValidating...........")
  const TransactionData: transactionData = req.body.payLoad
  var newTransaction: any = {
    outputs: [],
    inputs: [],
  }
  var amount = 0
  for (let index = 0; index < parseInt(TransactionData.numOutput); index++) {
    newTransaction.outputs.push({
      amount: TransactionData.transData[index].coins,
      recipient: aliases[TransactionData.transData[index].alias]
    })
    amount += parseInt(TransactionData.transData[index].coins)
  }
  console.log(newTransaction);
  const unusedouts: unusedOutputs = require("../../data/unusedOutputs.json");
  let balance = 0
  for (const transId in unusedouts) {
    const element: unusedOutput = unusedouts[transId];
    for (const index in element) {
      if (element[index].PublicKey == TransactionData.PublicKey) {
        balance = balance + parseInt(element[index].Coins)
        const newOutput = new Output(element[index].Coins, TransactionData.PublicKey.length.toString(), TransactionData.PublicKey)
        newOutput.updateBuffer()
        const signature = hexfromBuffer(await encryptOutput(TransactionData.PrivateKey, newOutput.buffer))
        newTransaction.inputs.push({
          transactionId: transId,
          index: index,
          signature: signature
        })
      }
    }
  }
  if (amount > balance) {
    console.log("Invalid Transaction! Rejecting.")
    res.status(422).json({ message: "Not Enough Balance" });
  }

  else {
    console.log("Valid Transaction! Processing.......")
    const left = balance - amount;
    newTransaction.outputs.push({
      amount: left.toString(),
      recipient: TransactionData.PublicKey
    })
    console.log(newTransaction)
    Axios({
      method: "POST",
      url: process.env.URL + "/newTransaction",
      data: JSON.stringify(newTransaction),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        console.log(`Processed!`)
      })
      .catch((error) => {
        console.error(error);
      });
  }
  res.status(201).json({ message: "Transcation Added" });
}


export { newTransaction, getPendingTransactions, processTransaction }