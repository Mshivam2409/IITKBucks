import * as fileSystem from "../../functions/fileSystem";
import verifyBlock from "../../functions/verifyBlock";
import processBlock from "../../functions/processBlock";
import * as fs from "fs"

const getBlock = async (req: any, res: any, next: any) => {
  const blockId = req.params.n;
  res.set("Content-type", "application/octet-stream")
  res.status(200).download("./src/data/blocks/" + blockId + ".dat");
};

const newBlock = async (req: any, res: any, next: any) => {
  const files = await fileSystem.readDirectory("./src/data/blocks/");
  console.log(files.length, "th Block Received!\nValidating......")
  const isValid = await verifyBlock(req.body);
  if (isValid) {
    console.log("Block is Valid\nProcessing.....")
    process.env.MINE = "false"
    await processBlock(req.body);
    const wstream = fs.createWriteStream(
      "./src/data/blocks/" + files.length + ".dat"
    );
    wstream.write(req.body);
    wstream.end();
    process.env.MINE = "true"
    console.log("Block Processed")
    res.status(201).json({ message: "Block Added" });
  } else {
    res.status(422).json({ message: "Invalid Block" });
  }
};

export { getBlock, newBlock }
