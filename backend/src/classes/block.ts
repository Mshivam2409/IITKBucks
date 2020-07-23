
const now = require("nano-time")
import * as crypto from "crypto"
import * as fs from "fs"
import BigNum from "bignum";

import Transaction from "./transaction";
import hextoBuffer from "../containers/hex";
import int32toBuffer from "../containers/int32";
import int64toBuffer from "../containers/int64";
import intfromBuffer from "../generators/int";




class Block {

  index: Buffer
  parentHash: Buffer;
  bodyHash: Buffer;
  target: Buffer;
  timestamp: Buffer;
  nonce: Buffer;
  body: Buffer;
  targetString: string;
  transactions: Array<Transaction>;
  bodyBuffer: Buffer;
  constructor(
    index: Buffer = Buffer.alloc(0),
    parentHash = Buffer.alloc(0),
    bodyHash = Buffer.alloc(0),
    target = Buffer.alloc(0),
    timestamp = Buffer.alloc(0),
    nonce = Buffer.alloc(0),
    bodyBuffer = Buffer.alloc(0)
  ) {
    this.index = index;
    this.parentHash = parentHash;
    this.bodyHash = bodyHash;
    this.target = target;
    this.timestamp = timestamp;
    this.nonce = nonce;
    this.body = bodyBuffer;
    this.targetString = "";
    this.transactions = [];
    this.bodyBuffer = bodyBuffer
  }

  async createBlockfromBodyBuffer(path: string, index: string, parentHash: string, target: string) {
    this.index = int32toBuffer(index.toString());
    this.parentHash = hextoBuffer(parentHash.toString());

    this.targetString = parentHash.toString();
    this.target = hextoBuffer(target.toString());
    const readfile = async (): Promise<Buffer> => {
      return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(path, { highWaterMark: 16 });
        const data: Array<any> = [];
        readStream.on("data", (chunk: any) => {
          data.push(chunk);
          // console.log("data :", chunk, chunk.length);
        });

        readStream.on("end", () => {
          // console.log("end :", Buffer.concat(data));
          resolve(Buffer.concat(data));
          // end : I am transferring in bytes by bytes called chunk
        });

        readStream.on("error", (err: Error) => {
          console.log("error :", err);
          reject();
        });
      });
    };
    const buffer = await readfile();
    this.bodyBuffer = buffer;
    var hash = crypto.createHash("sha256");
    var hash_update = hash.update(this.body);
    var generated_hash = hash_update.digest("hex");
    this.bodyHash = hextoBuffer(generated_hash.toString());
  }

  async generateNonce() {
    var index: BigNum = new BigNum("0")
    var targetNum = BigNum.fromBuffer(this.target);
    while (true) {
      var blockArray = [];
      blockArray.push(this.index);
      blockArray.push(this.parentHash);
      blockArray.push(this.bodyHash);
      blockArray.push(this.target);
      this.timestamp = int64toBuffer(now());
      blockArray.push(this.timestamp);
      blockArray.push(
        index.toBuffer({
          endian: "big",
          size: 8 /*8-byte / 64-bit*/,
        })
      );
      var buffer = Buffer.concat(blockArray);
      var hash = crypto.createHash("sha256");
      var hash_update = hash.update(buffer);
      var generated_hash = hash_update.digest("hex");
      var blockHash = hextoBuffer(generated_hash.toString());
      var blockHashNum = BigNum.fromBuffer(blockHash);
      if (
        generated_hash.toString() < this.targetString &&
        process.env.MINE == "true"
      ) {
        this.nonce = index.toBuffer({
          endian: "big",
          size: 8 /*8-byte / 64-bit*/,
        });
        console.log(
          index.toString(),
          generated_hash.toString(),
          BigNum.fromBuffer(this.timestamp).toString()
        );
        blockArray.push(this.body);
        var filenum;
        fs.readdir("./src/data/blocks", function (err, files) {
          filenum = files.length;
        });
        const wstream = fs.createWriteStream(
          "./src/data/blocks/" + filenum + ".dat"
        );
        wstream.write(Buffer.concat(blockArray));
        wstream.end();
        return index.toString();
      } else if (process.env.MINE == "false") {
        return -1;
      } else {
        index = BigNum.add(index, new BigNum("1"));
        blockArray = [];
      }
    }
  }
  async createBlockfromBuffer(blockData = Buffer.alloc(0)) {
    var index = 0;
    this.index = (blockData.slice(index, index + 4));
    index = index + 4;
    this.parentHash = (blockData.slice(index, index + 32));
    index = index + 32;
    this.bodyHash = (blockData.slice(index, index + 32));
    index = index + 32;
    this.target = (blockData.slice(index, index + 32));
    index = index + 32;
    this.timestamp = (blockData.slice(index, index + 8));
    index = index + 8;
    this.nonce = (blockData.slice(index, index + 8));
    index = index + 8;
    const numTrans = parseInt(
      intfromBuffer(blockData.slice(index, index + 4))
    );
    index = index + 4;
    for (let i = 0; i < numTrans; i++) {
      const size = parseInt(
        intfromBuffer(blockData.slice(index, index + 4))
      );
      index = index + 4;
      const newTrans = new Transaction();
      newTrans.createTransactionfromBuffer(
        blockData.slice(index, index + size)
      );
      index = index + size;
      this.transactions.push(newTrans);
    }
  }
};

export default Block