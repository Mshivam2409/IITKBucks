const utf8toBuffer = (str: string): Buffer => {
  var utf8 = unescape(encodeURIComponent(str));
  var arr = [];
  for (var i = 0; i < utf8.length; i++) {
    arr.push(utf8.charCodeAt(i));
  }
  return Buffer.from(arr);
};

export default utf8toBuffer
