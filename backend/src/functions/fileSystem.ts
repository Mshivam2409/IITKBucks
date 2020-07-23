import * as fs from "fs";

const readDirectory = async (dir: fs.PathLike): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, function (err, files: Array<string>) {
      resolve(files);
      if (err) {
        reject(err);
      }
    });
  });
};

const readFile = async (path: fs.PathLike): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(path, { highWaterMark: 16 });
    const data: Array<any> = [];
    readStream.on("data", (chunk) => {
      data.push(chunk);
    });

    readStream.on("end", () => {
      // console.log("end :", Buffer.concat(data));
      resolve(Buffer.concat(data));
      // end : I am transferring in bytes by bytes called chunk
    });

    readStream.on("error", (err) => {
      console.log("error :", err);
      reject();
    });
  });
};

const writeFile = async (path: fs.PathLike, data: Buffer): Promise<void> => {
  return new Promise((resolve, reject) => {
    const wstream = fs.createWriteStream(
      path
    );
    wstream.write(data);
    wstream.end();
    resolve();
  })
}

export { writeFile, readDirectory, readFile }