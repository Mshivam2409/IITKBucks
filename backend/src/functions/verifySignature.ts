import NodeRSA from "node-rsa";

const verifySignature = async (publicKey: string, signature: Buffer, data: Buffer) => {

  const key = new NodeRSA(publicKey);
  key.setOptions({ signingScheme: { scheme: "pss", hash: "sha256", saltLength: 32 } });
  return key.verify(data, signature, "buffer");
};

export default verifySignature
