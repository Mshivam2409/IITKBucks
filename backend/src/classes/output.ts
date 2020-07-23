import *  as fs from "fs"
import * as readline from "readline";
import utf8toBuffer from "../containers/utf8";
import int32toBuffer from "../containers/int32";
import int64toBuffer from "../containers/int64";

class Output {

  noOfcoins: string
  lenPubKey: string;
  pubKey: string;
  buffer: Buffer;

  constructor(noOfcoins?: string, lenPubKey?: string, pubKey?: string) {
    this.noOfcoins = noOfcoins;
    this.lenPubKey = lenPubKey;
    this.pubKey = pubKey;
    this.buffer = Buffer.alloc(0);
    return this
  }

  async createOutputfromUser() {
    var pubKeypath;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    const question1 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the number of coins ", (answer) => {
          this.noOfcoins = answer.toString();
          resolve();
        });
      });
    };

    const question2 = () => {
      return new Promise((resolve, reject) => {
        rl.question("Enter the path of public key ", (answer) => {
          pubKeypath = answer.toString();
          resolve();
        });
      });
    };

    await question1();
    await question2();
    rl.close();
    try {
      const data = fs.readFileSync(pubKeypath, "utf8");
      this.pubKey = data.toString();
      this.lenPubKey = data.length.toString();
    } catch (err) {
      console.error(err);
    }
    await this.updateBuffer();
  }

  async updateBuffer() {
    var BuffList = []
    BuffList.push(int64toBuffer(this.noOfcoins))
    BuffList.push(int32toBuffer(this.lenPubKey))
    BuffList.push(utf8toBuffer(this.pubKey))
    this.buffer = Buffer.concat(BuffList)
  }

  toBuffer() {
    return this.buffer
  }

  async print() {
    console.log("\t\tNumber of Coins :", this.noOfcoins);
    console.log("\t\tLength of Public Key :", this.lenPubKey);
    console.log("\t\tPublic Key :", this.pubKey)
  }
};

export default Output
