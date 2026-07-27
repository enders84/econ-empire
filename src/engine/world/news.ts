import { worldNews } from "../../data/worldNews";
import type { NewsArticle } from "../../models/NewsArticle";

export function getRandomNews(
  random: () => number = Math.random
): NewsArticle | null {
  if (worldNews.length === 0) {
    return null;
  }

  const newsIndex = Math.floor(
    random() * worldNews.length
  );

  return worldNews[newsIndex];
}