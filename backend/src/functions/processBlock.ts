import Block from "../classes/block"
import * as fs from "fs"
import { unusedOutputs } from "../classes/interfaces";


const processBlock = async (blockData: Buffer) => {
  console.log(blockData)
  console.log("Processing Block...")
  try {
    const unusedOutputs: unusedOutputs = require("../data/unusedOutputs.json");
    const newBlock = new Block();
    newBlock.createBlockfromBuffer(blockData);
    console.log(newBlock)
    for (let index = 0; index < newBlock.transactions.length; index++) {
      const trans = newBlock.transactions[index];
      for (let i = 0; i < trans[`inputs`].length; i++) {
        const index = trans[`inputs`][i][`index`].toString();
        if (unusedOutputs[trans[`inputs`][i][`transactionId`]]) {
          delete unusedOutputs[trans[`inputs`][i][`transactionId`]][`${index}`];
        }
      }
      for (let i = 0; i < trans[`outputs`].length; i++) {
        if (unusedOutputs[trans[`transactionId`]]) {
          unusedOutputs[trans[`transactionId`]][i + 1] = {
            PublicKey: trans[`outputs`][i][`pubKey`],
            Coins: trans[`outputs`][i][`noOfcoins`],
          };
        }
        else {
          unusedOutputs[trans[`transactionId`]] = {};
          unusedOutputs[trans[`transactionId`]][i + 1] = {
            PublicKey: trans[`outputs`][i][`pubKey`],
            Coins: trans[`outputs`][i][`noOfcoins`],
          };
        }
      }
    }
    fs.writeFileSync(
      "./src/data/unusedOutputs.json",
      JSON.stringify(unusedOutputs),
      "utf8",
    );
    var pendingTrans = require("../data/pendingTransactions.json");
    for (let index = 0; index < newBlock.transactions.length; index++) {
      delete pendingTrans[newBlock.transactions[index][`transactionId`]];
    }
    fs.writeFileSync(
      "./src/data/pendingTransactions.json",
      JSON.stringify(pendingTrans),
      "utf8",
    );
  } catch (error) {
    console.log(error)
  }

};

export default processBlock
