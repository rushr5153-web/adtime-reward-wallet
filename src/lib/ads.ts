export const DIRECT_LINKS = [
  "https://auctionr.org/4/ab654dadbe923c2e16b36a03da90b524",
  "https://auctionr.org/4/9c2cec10cbcea88208ba0ec9134f7852",
  "https://auctionr.org/4/0747c01e7a97a471efbe33ab0ccac289",
  "https://auctionr.org/4/2e3df160ec29d77fac4618cee95da5cf",
  "https://auctionr.org/4/c056442c76c2035dbfc32ee25cf03fee",
  "https://auctionr.org/4/ba1509e59bb6ca1813723f7d0b9dda32",
];

export const COUNTDOWN_SECONDS = 20;

/** Returns the next direct link in order, rotating through the list. */
export function nextLink(): string {
  const key = "earnx-link-index";
  const i = Number(localStorage.getItem(key) ?? "0") % DIRECT_LINKS.length;
  localStorage.setItem(key, String((i + 1) % DIRECT_LINKS.length));
  return DIRECT_LINKS[i];
}

export const PHOTOS = Array.from({ length: 100 }, (_, i) => {
  const id = 10 + i * 3;
  return {
    id,
    thumb: `https://picsum.photos/id/${id}/600/800`,
    full: `https://picsum.photos/id/${id}/2400/3200`,
  };
});
