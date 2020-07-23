import * as bodyParser from "body-parser"
const jsonParser = bodyParser.json();
const octetParser = bodyParser.raw({ type: "application/octet-stream" });

import express from "express"
const router = express.Router();

import * as blockController from "../controllers/block-controller"
import * as  transactionController from "../controllers/transaction-controller";
import * as peersController from "../controllers/peers-controller";
import * as aliasController from "../controllers/alias-controller"

router.get("/getBlock/:n", jsonParser, blockController.getBlock);
router.post("/newBlock", octetParser, blockController.newBlock);

router.get(
  "/getPendingTransactions",
  jsonParser,
  transactionController.getPendingTransactions
);
router.post(
  "/newTransaction",
  jsonParser,
  transactionController.newTransaction
);
router.post("/processTransaction", jsonParser, transactionController.processTransaction)

router.post("/newPeer", jsonParser, peersController.newPeer);
router.get("/getPeers", jsonParser, peersController.getPeers);

router.post("/addAlias", jsonParser, aliasController.addAlias);
router.get("/getPublicKey", jsonParser, aliasController.getPublicKey);
router.get("/getUnusedOutputs", jsonParser, aliasController.getUnusedOutputs);
router.get("/genPublicKey", jsonParser, aliasController.genPublicKey)
router.get("/genPrivateKey", jsonParser, aliasController.genPrivateKey);
router.post("/balance", jsonParser, aliasController.balance)
export default router
