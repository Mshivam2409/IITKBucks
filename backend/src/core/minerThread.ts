import Block from "../classes/block"
import Transaction from "../classes/transaction"
import { parentPort } from "worker_threads"
import int32toBuffer from "../containers/int32"
import * as fileSystem from "../functions/fileSystem"
import { JSONTransactions } from "../classes/interfaces"

const main = async () => {
  parentPort.postMessage({ result: "Not Found", nonce: -1 });
  const newBlock = new Block();
  var bodyBuff: Array<any> = [];
  var totalSize = 0;
  var elements = 0;
  const pendingTransactions: JSONTransactions = require("../data/pendingTransactions.json")
  for (const key in pendingTransactions) {
    const newTrans = new Transaction();
    await newTrans.createTransactionfromJSON(pendingTransactions[key]);
    const size = newTrans.buffer.length;
    if (size + totalSize < 100000) {
      bodyBuff.push(int32toBuffer(size.toString()));
      bodyBuff.push(newTrans.buffer);
      elements++;
    } else {
      break;
    }
  }
  const Buff =
    Buffer.concat([int32toBuffer(elements.toString()), ...bodyBuff]);

  await fileSystem.writeFile("./src/temp/body.dat", Buff);
  const index = (await fileSystem.readDirectory("./src/data/blocks")).length
  const blockChain = require("../data/blockChain.json")
  const parentHash = blockChain[(index - 1).toString()]
  const target = process.env.TARGET;
  await newBlock.createBlockfromBodyBuffer(
    "./src/.temp/body.dat",
    index.toString(),
    parentHash,
    target
  );
  const nonce = await newBlock.generateNonce();
  console.log(nonce);
  if (nonce > 0)
    parentPort.postMessage({ result: "Found", nonce: nonce });
};

main();
