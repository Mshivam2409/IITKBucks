const hextoBuffer = (str: string): Buffer => {
  return Buffer.from(str, 'hex');
};

export default hextoBuffer;
