export const TornadoCategory = (value) => {
  const category = [
    {
      type: "RARE",
      value: "RA",
      color: "#3b56ff",
    },
    {
      type: "EPIC",
      value: "EP",
      color: "#3b56ff",
    },
    {
      type: "LEGENDARY",
      value: "LG",
      color: "#3b56ff",
    },
    {
      type: "IMMORTAL",
      value: "IM",
      color: "#3b56ff",
    },
    {
      type: "COMMON",
      value: "CO",
      color: "#3b56ff",
    },
    {
      type: "UNCOMMON",
      value: "UCO",
      color: "#3b56ff",
    },
  ];

  const hurleyCategoryData = category.find((obj) => obj.type === value);
  return hurleyCategoryData;
};
