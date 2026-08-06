import { useEffect, useState } from 'react';

export default function useAutoCarousel(itemCount, interval = 5000) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const move = (direction) => {
    setCurrent((value) => (value + direction + itemCount) % itemCount);
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reducedMotion || itemCount < 2) return undefined;

    const timer = window.setInterval(() => {
      setCurrent((value) => (value + 1) % itemCount);
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval, itemCount, paused]);

  return { current, move, setPaused };
}
