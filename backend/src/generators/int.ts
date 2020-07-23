import BigNum from "bignum";

const intfromBuffer = (buffer: Buffer) => {
  return BigNum.fromBuffer(buffer).toString();
};

export default intfromBuffer