const WISHLIST_KEY = "bh_wishlist";
const RECENT_KEY = "bh_recent";

export const getWishlist = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};

export const isInWishlist = (productId: string): boolean => {
  return getWishlist().includes(productId);
};

export const addToWishlist = (productId: string): void => {
  const wishlist = getWishlist();
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
};

export const removeFromWishlist = (productId: string): void => {
  const wishlist = getWishlist().filter((id) => id !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
};

export const toggleWishlist = (productId: string): boolean => {
  if (isInWishlist(productId)) {
    removeFromWishlist(productId);
    return false;
  } else {
    addToWishlist(productId);
    return true;
  }
};

export const addToRecentlyViewed = (productId: string): void => {
  try {
    const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") as string[];
    const updated = [productId, ...recent.filter((id) => id !== productId)].slice(0, 10);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
    localStorage.setItem(RECENT_KEY, JSON.stringify([productId]));
  }
};

export const getRecentlyViewed = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
};
