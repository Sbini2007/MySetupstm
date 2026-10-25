"use client";

import { useEffect, useState } from "react";

const WORDS = ["setup", "ritmo", "bilanciamento", "tempo"];
const PREFIX = "Trova il tuo ";

export default function TextType() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
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
    if (!deleting && visibleCount < word.length) {
      timeout = window.setTimeout(() => setVisibleCount((count) => count + 1), 90);
    } else if (!deleting) {
      timeout = window.setTimeout(() => setDeleting(true), 1400);
    } else if (visibleCount > 0) {
      timeout = window.setTimeout(() => setVisibleCount((count) => count - 1), 38);
    } else {
      setWordIndex((index) => (index + 1) % WORDS.length);
      setDeleting(false);
    }

    return () => window.clearTimeout(timeout);
  }, [deleting, reduceMotion, visibleCount, word]);

  return (
    <h1
      aria-label={`${PREFIX}${WORDS.join(", ")}`}
      className="min-h-[1.2em] text-4xl font-black tracking-tight text-white sm:text-6xl"
    >
      <span className="text-zinc-400">{PREFIX}</span>
      <span
        aria-hidden="true"
        className="bg-gradient-to-r from-violet-300 to-white bg-clip-text text-transparent"
      >
        {reduceMotion ? word : word.slice(0, visibleCount)}
      </span>
      {!reduceMotion && (
        <span aria-hidden="true" className="ml-0.5 animate-pulse text-violet-300">
          _
        </span>
      )}
    </h1>
  );
}
