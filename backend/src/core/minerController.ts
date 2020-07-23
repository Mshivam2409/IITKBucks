import * as fileSystem from "../functions/fileSystem"
import Axios from "axios"
import { Worker, SHARE_ENV } from "worker_threads"
import processBlock from "../functions/processBlock";
import { JSONTransactions } from "../classes/interfaces";

const startMining = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./core/minerThread.js", {
      env: SHARE_ENV
    });
    worker.on("message", (msg) => {
      console.log(msg);
      if (msg.result === "Found") {
        resolve(true);
      }
    });
    worker.on("error", (err) => {
      console.log(err);
    });
    worker.on("exit", (code) => {
      console.log(code);
      if (code != 0)
        reject(false)
    });
  });
};

const minerController = async () => {
  while (true) {
    const pendingTrans: JSONTransactions = require("../data/pendingTransactions.json")
    if (pendingTrans === {}) {
      await new Promise(r => setTimeout(r, 2000));
    }
    else {
      const valid = await startMining();
      if (valid) {
        const files = await fileSystem.readDirectory("./src/data/blocks")
        const blockData = await fileSystem.readFile("./src/data/blocks" + (files.length - 1) + ".dat")
        await processBlock(blockData);
        const peers: Array<string> = require("../data/peers.json")
        for (let index = 0; index < peers.length; index++) {
          const peer = peers[index];
          Axios({
            method: "POST",
            url: peer + "/newBlock",
            data: blockData,
            headers: {
              "Content-Type": "application/octet-stream"
            },
            validateStatus: () => true,
          })
            .then((res: any) => {
              console.log("Block sent to", peer)
            })
            .catch((error: any) => {
              console.error(error);
            });
        }
      }
    }
  }
}

export default minerController