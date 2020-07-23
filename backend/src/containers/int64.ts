const int64toBuffer = (str: string): Buffer => {
  var bignum = require("bignum");
  var num = bignum(str);
  var int64buffer = num.toBuffer({
    endian: "big",
    size: 8 /*8-byte / 64-bit*/,
  });
  return int64buffer;
};

export default int64toBuffer
