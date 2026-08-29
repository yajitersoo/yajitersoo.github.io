const assetPattern = /\.(?:avif|gif|jpe?g|pdf|png|svg|webp|mp4|webm)(?:[?#].*)?$/i;

export const isExternalUrl = (value: string | null) => Boolean(value?.match(/^https?:\/\//i));

export const isViewableAsset = (value: string | null) => Boolean(value?.match(assetPattern));

export function getProductHref(mediaUrl: string, title: string) {
  if (!isViewableAsset(mediaUrl)) return mediaUrl;
  const query = new URLSearchParams({ src: mediaUrl, title });
  return `/product/?${query.toString()}`;
}

export const opensInNewTab = (mediaUrl: string | null) =>
  isExternalUrl(mediaUrl) && !isViewableAsset(mediaUrl);
