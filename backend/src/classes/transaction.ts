import Input from "./input";
import Output from "./output";
import * as readline from "readline"
import * as crypto from "crypto"
import { JSONTransaction, unusedOutputs } from "./interfaces";
import verifySignature from "../functions/verifySignature"
import int32toBuffer from "../containers/int32";
import intfromBuffer from "../generators/int";
import hexfromBuffer from "../generators/hexString";
import hextoBuffer from "../containers/hex";
import utf8fromBuffer from "../generators/utf8String";

class Transaction {

  transactionId: string
  numInput: Number;
  numOutput: Number;
  inputs: Array<Input>;
  outputs: Array<Output>;
  bufferList: Array<any>
  outputdataHash: string;
  buffer: Buffer;

  constructor(numInput = 0, numOutput = 0) {
    this.transactionId = "";
    this.numInput = numInput;
    this.numOutput = numOutput;
    this.outputs = [];
    this.bufferList = [];
    this.outputdataHash = "";
    this.buffer = Buffer.alloc(0);
    this.inputs = [];
  }

  async addInput(transactionId: string, index: string, signature: string) {
    const newInput = new Input(
      transactionId,
      index,
      (signature.length / 2).toString(),
      signature
    );
    await newInput.updateBuffer();
    this.inputs.push(newInput);
    this.bufferList.push(newInput.buffer);
  }

  async addOutput(noofcoins: string, keydata: string) {
    const newOutput = new Output(noofcoins, keydata.length.toString(), keydata);
    await newOutput.updateBuffer();
    this.outputs.push(newOutput);
    this.bufferList.push(newOutput.buffer);
  }

  async createTransactionfromJSON(data: JSONTransaction) {
    this.bufferList.push(int32toBuffer(this.numInput.toString()));
    for (let index = 0; index < data.inputs.length; index++) {
      const input = data.inputs[index];
      await this.addInput(input.transactionId, input.index, input.signature);
    }
    this.bufferList.push(int32toBuffer(this.numOutput.toString()));
    for (let index = 0; index < data.outputs.length; index++) {
      const output = data.outputs[index];
      await this.addOutput(output.amount, output.recipient);
    }
    await this.updateTransactionId();
  }

  async createTransactionfromUser() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    var numInput = 0,
      numOutput = 0;

    const question1 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the number of inputs :", (answer: string) => {
          numInput = parseInt(answer);
          resolve();
        });
      });
    };

    const question2 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the number of outputs :", (answer: string) => {
          numOutput = parseInt(answer);
          resolve();
        });
      });
    };
    await question1();
    await question2();
    rl.close();
    this.bufferList = [];
    this.bufferList.push(int32toBuffer(numInput.toString()));
    for (var i = 0; i < numInput; i++) {
      const newInput = new Input();
      await newInput.createInputfromUser();
      this.inputs.push(newInput);
      this.bufferList.push(newInput.buffer);
    }
    this.bufferList.push(int32toBuffer(numOutput.toString()));
    for (var i = 0; i < numOutput; i++) {
      const newOutput = new Output();
      await newOutput.createOutputfromUser();
      this.outputs.push(newOutput);
      this.bufferList.push(newOutput.buffer);
    }

    this.buffer = Buffer.concat(this.bufferList);
    this.numInput = numInput;
    this.numOutput = numOutput;
    await this.updateTransactionId();
  }

  async createTransactionfromBuffer(Buff: Buffer) {
    this.buffer = Buff;
    this.bufferList = [];
    this.bufferList.push(Buff);
    var hash = crypto.createHash("sha256");
    var hash_update = hash.update(Buff);
    var generated_hash = hash_update.digest("hex");
    this.transactionId = generated_hash.toString();
    var index = 0;
    const numInputStr = intfromBuffer(Buff.slice(index, index + 4));
    index = index + 4;
    const numInput = parseInt(numInputStr);
    this.numInput = numInput;
    for (let i = 1; i <= numInput; i++) {
      const newInput = new Input();
      newInput.transactionId = hexfromBuffer(
        Buff.slice(index, index + 32)
      );
      index = index + 32;
      newInput.index = intfromBuffer(Buff.slice(index, index + 4));
      index = index + 4;
      newInput.lenSign = intfromBuffer(Buff.slice(index, index + 4));
      const lenSign = parseInt(newInput.lenSign);
      index = index + 4;
      newInput.signature = hexfromBuffer(
        Buff.slice(index, index + lenSign)
      );
      index = index + lenSign;
      this.inputs.push(newInput);
    }
    const numOutputStr = intfromBuffer(Buff.slice(index, index + 4));
    index = index + 4;
    const numOutput = parseInt(numOutputStr);
    this.numOutput = numOutput;
    for (let i = 1; i <= numOutput; i++) {
      const newOutput = new Output();
      newOutput.noOfcoins = intfromBuffer(Buff.slice(index, index + 8));
      index = index + 8;
      newOutput.lenPubKey = intfromBuffer(Buff.slice(index, index + 4));
      const lenKey = parseInt(newOutput.lenPubKey);
      index = index + 4;
      newOutput.pubKey = utf8fromBuffer(
        Buff.slice(index, index + lenKey)
      );
      index = index + lenKey;
      this.outputs.push(newOutput);
    }
  }

  toBuffer() {
    return this.buffer;
  }

  async updateTransactionId() {
    this.buffer = Buffer.concat(this.bufferList);
    var hash = crypto.createHash("sha256");
    var hash_update = hash.update(this.buffer);
    var generated_hash = hash_update.digest("hex");
    this.transactionId = generated_hash.toString();
  }

  async print() {
    console.log("Transaction Id :", this.transactionId);
    console.log("\tNumber of Inputs :", this.inputs.length);
    for (let index = 0; index < this.inputs.length; index++) {
      console.log("\t\tInput", index + 1);
      await this.inputs[index].print();
    }
    console.log("\tNumber of Outputs :", this.numOutput);
    for (let index = 0; index < this.outputs.length; index++) {
      console.log("\t\tOutput", index + 1);
      await this.outputs[index].print();
    }
  }

  async createOutputDataHash() {
    var list = [];
    list.push(int32toBuffer(this.numOutput.toString()));
    for (let index = 0; index < this.outputs.length; index++) {
      list.push(this.outputs[index][`buffer`]);
    }
    const outputdataBuff = Buffer.concat(list);
    var hash = crypto.createHash("sha256");
    var hash_update = hash.update(outputdataBuff);
    var generated_hash = hash_update.digest("hex");
    this.outputdataHash = generated_hash.toString();
  }

  async verifyTransaction() {
    const listUnusedOutputs: unusedOutputs = require("../data/unusedOutputs.json");


    let inputCoins = 0;
    for (let i = 0; i < this.numInput; i++) {
      if (
        typeof listUnusedOutputs[this.inputs[i][`transactionId`]][
        this.inputs[i][`index`]
        ] != "undefined"
      ) {
        inputCoins =
          inputCoins +
          parseInt(listUnusedOutputs[this.inputs[i][`transactionId`]][
            this.inputs[i][`index`]
          ]["Coins"]);
        var list = [];
        list.push(hextoBuffer(this.inputs[i][`transactionId`]));
        list.push(int32toBuffer(this.inputs[i][`index`]));
        list.push(hextoBuffer(this.outputdataHash));
        let isValid = false;
        isValid = await verifySignature(
          listUnusedOutputs[this.inputs[i][`transactionId`]][
          this.inputs[i][`index`]
          ]["PublicKey"],
          hextoBuffer(this.inputs[i][`signature`]),
          Buffer.concat(list)
        );
        if (!isValid) {
          return false;
        }
      } else {
        delete listUnusedOutputs[this.inputs[i][`transactionId`]][this.inputs[i][`index`]]

      }
      let outputCoins = 0;
      for (let index = 0; index < this.outputs.length; index++) {
        outputCoins = outputCoins + parseInt(this.outputs[index].noOfcoins);
      }
      if (outputCoins > inputCoins) return false;
      return true;
    }
  }
};

export default Transaction

