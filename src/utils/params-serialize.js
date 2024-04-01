export const ParamsSerialize = (params) => {
  // console.log(encodeURIComponent(JSON.stringify(params, "params")));
  // return encodeURIComponent(JSON.stringify(params).toString());
  const parts = [];
  const encode = (val) => {
    return encodeURIComponent(val)
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+")
      .replace(/%5B/gi, "[")
      .replace(/%5D/gi, "]");
  };
  const convertPart = (key, val) => {
    if (val instanceof Date) val = val.toISOString();
    else if (val instanceof Object) val = JSON.stringify(val);
    parts.push(encode(key) + "=" + encode(val));
  };
  Object.entries(params).forEach(([key, val]) => {
    if (val === null || typeof val === "undefined") return;
    if (Array.isArray(val))
      val.forEach((v, i) => convertPart(`${key}[${i}]`, v));
    else convertPart(key, val);
  });
  return parts.join("&");
};
