import verifyBlock from "./verifyBlock";
import Axios, { AxiosError } from "axios"
import * as fileSystem from "./fileSystem"
import processBlock from "./processBlock";
import * as fs from "fs"

const init = async () => {

  var potentialPeers = require("../data/potentialPeers.json");
  console.log(potentialPeers)
  var peers = require("../data/peers.json");
  while (peers.length == 0) {
    for (let index = 0; index < potentialPeers.length; index++) {
      const potentialPeer = potentialPeers[index];
      await Axios({
        method: "POST",
        url: potentialPeer + "/newPeer",
        data: { url: process.env.URL },
        validateStatus: () => true,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((res) => {
          console.log(res.status)
          if (res.status == 500) {
            potentialPeers.splice(index);
          } else if (res.status == 200 || res.status == 201) {
            potentialPeers.splice(index);
            peers.push(potentialPeer);
            if (peers.length == 1) {
              processData(peers[0]);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });

      console.log("Peers", peers.length);

      await Axios({
        method: "GET",
        url: potentialPeer + "/getPeers",
      })
        .then((res) => {
          potentialPeers = Array.from(
            new Set(potentialPeers.concat(res.data.peers))
          );
        })
        .catch((error: AxiosError) => {
          console.error(error.code);
        });
    }
    break;
  }
  fs.writeFileSync(
    "./src/data/peers.json",
    JSON.stringify(peers),
  );
};

const processData = async (url: fs.PathLike) => {
  console.log(
    "Fetching Data from ", url
  )
  var i = 0, possible = true;
  while (possible) {
    console.log("Fetching ", i, "Block")
    await Axios({
      method: "GET",
      url: url + "/getBlock/" + i,
      responseType: "arraybuffer",
      validateStatus: () => true,
    })
      .then(async (res) => {
        console.log(res.status)
        if (res.status == 404) {
          possible = false;
        } else if (res.status == 200 || res.status == 201) {
          await fileSystem.writeFile("./src/.temp/" + i + ".dat", res.data);
          const data = await fileSystem.readFile("./src/.temp/" + i + ".dat")
          const valid = await verifyBlock(data)
          console.log("Block is ", valid ? "Valid" : "Invalid");
          if (valid)
            await processBlock(data);
          i++;
        }
      })
      .catch((error) => {
        console.error(error.code);
      });
  }
  await Axios({
    method: "GET",
    url: url + "/getPendingTransactions",
  })
    .then(async (res) => {
      for (let index = 0; index < res.data.length; index++) {
        res.data[index];
        await Axios({
          method: "POST",
          url: process.env.URL + "/newTransaction",
          data: res.data[index],
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then((res) => {
            console.log(`${index} Transaction Added!`)
          })
          .catch((error) => {
            console.error(error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export { init, processData }
