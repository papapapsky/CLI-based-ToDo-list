export const visualWaiting = (
  interval?: NodeJS.Timeout,
): NodeJS.Timeout | null => {
  let dots = 0;
  if (interval) {
    clearInterval(interval);
    return null;
  }

  return setInterval(() => {
    console.clear();
    console.log(`Please wait${".".repeat(dots)}`);
    dots++;
    dots === 4 ? (dots = 0) : null;
  }, 150);
};
