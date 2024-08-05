export const decodeSearchParam = (encodedString: string) => {
  const firstDecode = decodeURIComponent(encodedString);

  const finalDecode = decodeURIComponent(firstDecode);

  return finalDecode;
};
