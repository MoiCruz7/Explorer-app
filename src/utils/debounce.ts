export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args): void => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}