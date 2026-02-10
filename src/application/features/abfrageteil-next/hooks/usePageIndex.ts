import { useParams } from "react-router";

export function usePageIndex(fallback = 0): number {
  const { index } = useParams<{ index?: string }>();

  if (index === undefined) {
    return fallback;
  }

  const parsedIndex = parseInt(index, 10);

  return isNaN(parsedIndex) ? fallback : parsedIndex;
}
