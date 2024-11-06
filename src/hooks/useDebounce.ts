import { useRef } from "react";

function useDebounce<T>(func: (arg: T) => void, wait: number) {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  return (arg: T) => {
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(() => func(arg), wait);
  };
}

export default useDebounce;
