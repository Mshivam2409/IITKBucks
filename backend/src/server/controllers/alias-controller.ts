import * as fs from "fs"
import NodeRSA from "node-rsa";
import { unusedOutputs, unusedOutput } from "../../classes/interfaces";

const addAlias = (req: any, res: any, next: any) => {
  const alias = req.body.alias;
  const pubKey = req.body.publicKey;
  const aliases = require("../../data/aliases.json");
  if (aliases[alias]) {
    res.status(409).json({ message: "Already Existing" });
  }
  aliases[alias] = pubKey;
  fs.writeFileSync(
    "./src/data/aliases.json",
    JSON.stringify(aliases),
    "utf8",
  );
  console.log("Alias under name ", alias, " created")
  res.status(201).json({ message: "Alias Created" })
};

const getPublicKey = async (req: any, res: any, next: any) => {
  const alias = req.body.alias;
  const aliases = require("../../data/aliases.json");

  res.status(200).json({ publicKey: aliases[alias] });
};

const getUnusedOutputs = async (req: any, res: any, next: any) => {
  const aliases = require("../../data/aliases.json");
  const unusedouts: unusedOutputs = require("../../data/unusedOutputs.json");
  let key;
  if (req.body.alias) {
    key = aliases[req.body.alias];
  } else if (req.body.publickey) {
    key = req.body.publickey
  }
  let list = []
  for (const transId in unusedouts) {
    const element: unusedOutput = unusedouts[transId];
    for (const index in element) {
      if (element[index].PublicKey == key) {
        list.push({
          transactionId: transId,
          index: index,
          amount: element[index].Coins,
        })
      }
    }
  }
  res.status(200).json({ UnusedOutputs: list });
};

const genPublicKey = async (req: any, res: any, next: any) => {
  res.status(201).download("./src/.temp/publicKey.pem")
};

const genPrivateKey = async (req: any, res: any, next: any) => {
  const key = new NodeRSA();
  key.setOptions({ signingScheme: "pss-sha256" })
  key.generateKeyPair()
  const pubKey = key.exportKey("public")
  const privKey = key.exportKey("private")
  fs.writeFileSync(
    "./src/.temp/publicKey.pem",
    pubKey,
    "utf8"
  );
  fs.writeFileSync(
    "./src/.temp/privateKey.pem",
    privKey,
    "utf8"
  );
  res.status(201).download("./src/data/privateKey.pem")
}

const balance = async (req: any, res: any, next: any) => {
  const aliases = require("../../data/aliases.json");
  const unusedouts: unusedOutputs = require("../../data/unusedOutputs.json");
  let key;
  let valid = false
  if (req.body.alias) {
    key = aliases[req.body.alias];
    if (key)
      valid = true;
  } else if (req.body.publicKey) {
    key = req.body.publicKey
  }
  let balance = 0
  for (const transId in unusedouts) {
    const element: unusedOutput = unusedouts[transId];
    for (const index in element) {
      if (element[index].PublicKey == key) {
        valid = true
        balance = balance + parseInt(element[index].Coins)
      }
    }
  }
  if (valid)
    res.status(200).json({ Balance: balance });
  else
    res.status(404).json({ message: "Unknown user" })
};


export { addAlias, getPublicKey, getUnusedOutputs, genPublicKey, genPrivateKey, balance }