import NodeRSA from "node-rsa";

const encryptOutput = async (privateKey: string, data: Buffer): Promise<Buffer> => {

    const key = new NodeRSA(privateKey);
    key.setOptions({ signingScheme: { scheme: "pss", hash: "sha256", saltLength: 32 } });
    return key.sign(data, "buffer");
};

export default encryptOutput
