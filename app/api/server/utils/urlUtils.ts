/**
 * 画像URLに`width`クエリを追加する
 */
export const addWidthQuery = (urlString: string | null, widthValue = "800") => {
  if (!urlString) return urlString;

  const url = new URL(urlString);
  url.searchParams.set("width", widthValue);
  return url.toString();
};
