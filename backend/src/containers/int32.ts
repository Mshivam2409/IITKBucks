const int32toBuffer = (str: string): Buffer => {
  var bignum = require("bignum");
  var num = bignum(str);
  var int32buffer = num.toBuffer({
    endian: "big",
    size: 4 /*4-byte / 32-bit*/,
  });
  return int32buffer;
};

export default int32toBuffer
