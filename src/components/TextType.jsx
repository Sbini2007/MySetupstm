"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["setup", "ritmo", "bilanciamento", "tempo"];
const PREFIX = "Trova il tuo ";

export default function TextType() {
  const [wordIndex, setWordIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const animatedWordRef = useRef(null);
  const word = WORDS[wordIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    let timeout;
    let visibleCount = 0;
    let deleting = false;

    const updateText = () => {
      if (animatedWordRef.current) {
        animatedWordRef.current.textContent = word.slice(0, visibleCount);
      }
    };

    const animate = () => {
      if (!deleting && visibleCount < word.length) {
        visibleCount += 1;
        updateText();
        timeout = window.setTimeout(animate, 90);
      } else if (!deleting) {
        deleting = true;
        timeout = window.setTimeout(animate, 1400);
      } else if (visibleCount > 0) {
        visibleCount -= 1;
        updateText();
        timeout = window.setTimeout(animate, 38);
      } else {
        setWordIndex((index) => (index + 1) % WORDS.length);
      }
    };

    if (animatedWordRef.current) animatedWordRef.current.textContent = "";
    timeout = window.setTimeout(animate, 90);

    return () => window.clearTimeout(timeout);
  }, [reduceMotion, word, wordIndex]);

  return (
    <h1
      aria-label={`${PREFIX}${WORDS.join(", ")}`}
      className="min-h-[1.2em] text-4xl font-black tracking-tight text-white sm:text-6xl"
    >
      <span className="text-zinc-400">{PREFIX}</span>
      <span
        ref={animatedWordRef}
        aria-hidden="true"
        className="bg-gradient-to-r from-violet-300 to-white bg-clip-text text-transparent"
      >
        {reduceMotion ? word : ""}
      </span>
      {!reduceMotion && (
        <span aria-hidden="true" className="ml-0.5 animate-pulse text-violet-300">
          _
        </span>
      )}
    </h1>
  );
}
