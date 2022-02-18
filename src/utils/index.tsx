export const imageAddPrefix = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : window.systemConfig.imagePrefix + url;
};
