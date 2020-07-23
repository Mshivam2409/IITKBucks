import * as fs from "fs"

const getPeers = async (req: any, res: any, next: any) => {
  const peers = require("../../data/peers.json");
  res.status(200).json({ peers: peers });
};

const newPeer = async (req: any, res: any, next: any) => {
  var peers = require("../../data/peers.json");
  if (peers.length >= 5) {
    res.status(500).json({ message: "Peers list full" });
  }
  else {
    peers.push(req.body.url.toString());
    var data = JSON.stringify(peers);
    fs.writeFileSync("./src/data/peers.json", data, "utf8");
    res.status(201).json({ message: "Peer Added" });
  }
};

export { newPeer, getPeers }
