export const isValidUrl = (url: string): boolean => {
  const urlRegex = /^(https?|ftp):\/\/(www\.)?[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
};
