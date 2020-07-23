import Block from "../classes/block"
import * as crypto from "crypto"
import * as fs from "fs"
import hexfromBuffer from "../generators/hexString";
import intfromBuffer from "../generators/int";
import { blockChain } from "../classes/interfaces";


const verifyBlock = async (blockData: Buffer) => {
  console.log("Verifying Block.....")
  try {
    const newBlock = new Block();
    await newBlock.createBlockfromBuffer(blockData);
    for (let index = 0; index < newBlock.transactions.length; index++) {
      const trans = newBlock.transactions[index];
      if (!trans.verifyTransaction()) {
        console.log("Invalid Transaction....")
        return false;
      }
    }
    const bodyBuff = blockData.slice(116, blockData.length);
    var hash = crypto.createHash("sha256");
    var hash_update = hash.update(bodyBuff);
    var generated_hash = hash_update.digest("hex");
    var bodyHash = generated_hash.toString();
    if (bodyHash != (hexfromBuffer(newBlock.bodyHash))) {
      console.log(bodyHash, (newBlock.bodyHash).toString('hex'))
      console.log("Invalid bodyHash....")
      return false;
    }
    const blockchain: blockChain = require("../data/blockChain.json")
    if (
      hexfromBuffer(newBlock.parentHash) != blockchain[(parseInt(intfromBuffer(newBlock.index)) - 1).toString()] && parseInt(intfromBuffer(newBlock.index)) > 0
    ) {
      console.log("Invalid Parent Hash")
      return false;
    }

    const headBuff = blockData.slice(0, 116);
    var hash = crypto.createHash("sha256");
    var hash_update = hash.update(headBuff);
    var generated_hash = hash_update.digest("hex");
    var headHash = generated_hash.toString();

    if (headHash > hexfromBuffer(newBlock.target)) {
      console.log("Invalid Nonce")
      return false;
    }
    var blockChain: blockChain = require('../data/blockChain.json')
    blockChain[intfromBuffer(newBlock.index)] = headHash;
    fs.writeFileSync(
      "./src/data/blockChain.json",
      JSON.stringify(blockChain),
      "utf8",
    )
    return true
  } catch (error) {
    console.log(error)
  }

};

export default verifyBlock
