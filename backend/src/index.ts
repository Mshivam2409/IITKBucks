import express from "express"
import { init, processData } from "./functions/init";
import minerController from "./core/minerController";
import router from "./server/routes/routes";
import * as fs from "fs"
import * as dotenv from "dotenv"
import *  as path from "path"

dotenv.config()

const app = express();

if (process.env.ENVIRONMENT === "PRODUCTION") {
  const publicPath = process.env.BUILD_DIRECTORY
  app.use(express.static(publicPath));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(publicPath + "/index.html"));
  });
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use(router);

app.use((error: any, req: any, res: any, next: any) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

app.listen(3492, () => {

  minerController();
  init()
  try {
    fs.mkdirSync("./src/data/blocks")
    fs.mkdirSync("./src/.temp")
    console.log("Temp directories Created!")
  } catch (error) {
    console.log("Temp directories Created!")
  }
  console.log("Blockchain server listening on port", 3492, "\nURL:", process.env.URL)
  init();
});
