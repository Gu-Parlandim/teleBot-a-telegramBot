export const normalizeUrl = (url: string): string => {
  const cdneRegex = /^\/\/cdne[^\s]*$/i;
  if (cdneRegex.test(url)) {
    return `http:${url}`;
  }
  return url;
};
