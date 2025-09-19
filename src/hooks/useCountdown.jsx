import { useState, useEffect, useRef } from "react";

function useCountdown(initialTime, started, handleSelect, currentIndex) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const prevTimeRef = useRef(timeLeft);

  useEffect(() => {
    if (!started) return;

    setTimeLeft(initialTime); // reset ogni volta che parte il countdown

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [started, initialTime, currentIndex]);

  useEffect(() => {
    // Chiamare handleSelect(null) solo quando il timer passa da 1 a 0
    if (prevTimeRef.current === 1 && timeLeft === 0 && started) {
      handleSelect(null);
    }
    prevTimeRef.current = timeLeft;
  }, [timeLeft, started, handleSelect]);

  console.log("timeLeft", timeLeft);
  return timeLeft;
}

export default useCountdown;
