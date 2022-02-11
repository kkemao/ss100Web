export const imageAddPrefix = (url: string) =>
  url.startsWith("http") ? url : window.systemConfig.imagePrefix + url;
