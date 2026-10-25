"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";

export default function AnimatedList({
  items = [],
  onItemSelect,
  width,
  maxHeight = 580,
  radius = 16,
  frame = true,
  displayScrollbar = true,
  initialSelectedIndex = 0,
  selectedId,
  className = "",
  itemClassName = "",
  animation = "pop",
  theme = "dark",
  gap = 8,
  stagger = 0.05,
  fadeSize = 48,
  showGradients = false,
  selectOnHover = false,
  enableArrowNavigation = false,
  loop = false,
  animateOnce = true,
}) {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(initialSelectedIndex);
  const [visibleItems, setVisibleItems] = useState({});
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const visibleItemsRef = useRef(new Set());
  const revealQueueRef = useRef([]);
  const queuedIndexesRef = useRef(new Set());
  const revealTimerRef = useRef(null);
  const isDark = theme === "dark";
  const itemsSignature = useMemo(
    () =>
      items
        .map((item) =>
          [item.id, item.slug, item.title, item.description, item.flagCode, item.round].join(":")
        )
        .join("|"),
    [items]
  );

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  useEffect(() => {
    if (!items.length || !listRef.current) return;

    visibleItemsRef.current.clear();
    revealQueueRef.current = [];
    queuedIndexesRef.current.clear();
    setVisibleItems({});

    const revealDelay = Math.min(Math.max(stagger * 1000, 60), 150);
    let observer;

    const revealNext = () => {
      if (revealTimerRef.current || revealQueueRef.current.length === 0) return;

      const index = revealQueueRef.current.shift();
      queuedIndexesRef.current.delete(index);
      const node = itemRefs.current[index];

      if (animateOnce && node && observer) observer.unobserve(node);
      visibleItemsRef.current.add(index);
      setVisibleItems((current) => ({ ...current, [index]: true }));

      revealTimerRef.current = window.setTimeout(() => {
        revealTimerRef.current = null;
        revealNext();
      }, revealDelay);
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          if (!Number.isFinite(index)) return;

          if (entry.isIntersecting) {
            if (!visibleItemsRef.current.has(index) && !queuedIndexesRef.current.has(index)) {
              revealQueueRef.current.push(index);
              queuedIndexesRef.current.add(index);
            }
          } else if (!animateOnce) {
            visibleItemsRef.current.delete(index);
            queuedIndexesRef.current.delete(index);
            revealQueueRef.current = revealQueueRef.current.filter((queuedIndex) => queuedIndex !== index);
            setVisibleItems((current) => ({ ...current, [index]: false }));
          }
        });

        revealNext();
      },
      {
        root: listRef.current,
        threshold: 0.18,
      }
    );

    itemRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => {
      observer.disconnect();
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
      revealQueueRef.current = [];
      queuedIndexesRef.current.clear();
    };
  }, [animateOnce, items.length, itemsSignature, stagger]);

  const activeIndex =
    selectedId !== undefined
      ? selectedId === null
        ? -1
        : items.findIndex((it) => it.id === selectedId || it.slug === selectedId)
      : internalSelectedIndex;

  const handleSelect = useCallback(
    (item, index) => {
      setInternalSelectedIndex(index);
      if (onItemSelect) {
        onItemSelect(item, index);
      }
    },
    [onItemSelect]
  );

  const handleKeyNavigation = useCallback(
    (event) => {
      if (!enableArrowNavigation || items.length === 0) return;
      const currentIndex = activeIndex >= 0 ? activeIndex : 0;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = loop
          ? (currentIndex + 1) % items.length
          : Math.min(currentIndex + 1, items.length - 1);
        const nextItem = items[nextIndex];
        if (nextItem) handleSelect(nextItem, nextIndex);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const nextIndex = loop
          ? (currentIndex - 1 + items.length) % items.length
          : Math.max(currentIndex - 1, 0);
        const nextItem = items[nextIndex];
        if (nextItem) handleSelect(nextItem, nextIndex);
      }
    },
    [activeIndex, enableArrowNavigation, handleSelect, items, loop]
  );

  const formattedMaxHeight = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

  const gradientClasses = useMemo(() => {
    if (!showGradients) return "";
    return isDark
      ? "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-10 before:bg-gradient-to-b before:from-[#0c0d14] before:to-transparent after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-10 after:bg-gradient-to-t after:from-[#0c0d14] after:to-transparent"
      : "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-10 before:bg-gradient-to-b before:from-white before:to-transparent after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-10 after:bg-gradient-to-t after:from-white after:to-transparent";
  }, [isDark, showGradients]);

  return (
    <div
      style={{
        width: width || "100%",
        borderRadius: radius,
      }}
      className={`relative outline-none ${
        frame
          ? isDark
            ? "border border-white/[0.08] bg-[#0c0d14] shadow-xl"
            : "border border-slate-200 bg-white shadow-xl"
          : "bg-transparent"
      } ${className}`}
    >
      <div
        ref={listRef}
        onKeyDown={handleKeyNavigation}
        style={{
          maxHeight: formattedMaxHeight,
          padding: frame ? "10px" : "4px",
          gap: `${gap}px`,
        }}
        className={`relative flex flex-col overflow-y-auto ${gradientClasses} ${
          displayScrollbar
            ? "scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent"
            : "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        }`}
      >
        {items.length > 0 ? (
          items.map((item, index) => {
            const isSelected =
              activeIndex === index ||
              (selectedId && (item.id === selectedId || item.slug === selectedId));
            const isVisible = visibleItems[index] ?? false;

            return (
              <button
                key={item.id || item.slug || item.title || index}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                data-index={index}
                type="button"
                onClick={() => handleSelect(item, index)}
                onMouseEnter={() => selectOnHover && handleSelect(item, index)}
                className={`w-full relative flex items-center justify-between text-left rounded-xl p-3 cursor-pointer ${isDark ? "text-zinc-300" : "text-slate-600"} ${itemClassName}`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) scale(1)" : `translateY(${fadeSize}px) scale(0.985)`,
                  transition: `opacity 0.28s ease, transform 0.28s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease`,
                  border: isSelected ? (isDark ? "1px solid rgba(167,139,250,0.55)" : "1px solid rgba(109,40,217,0.4)") : isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(15,23,42,0.08)",
                  background: isSelected
                    ? isDark
                      ? "rgba(139,92,246,0.18)"
                      : "rgba(139,92,246,0.10)"
                    : isDark
                      ? "rgba(12,13,21,1)"
                      : "rgba(255,255,255,0.92)",
                  boxShadow: isSelected
                    ? isDark
                      ? "0 8px 24px rgba(139,92,246,0.12)"
                      : "0 8px 24px rgba(109,40,217,0.10)"
                    : "none",
                }}
              >
                {isSelected && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-violet-400" />
                )}

                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {item.flagCode && (
                    <div className="relative h-6 w-8 shrink-0 overflow-hidden rounded border border-white/10 bg-black/40">
                      <Image
                        src={`/flags/${item.flagCode}.svg`}
                        alt=""
                        width={32}
                        height={20}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-2">
                      {item.round && (
                        <span className={`font-mono text-[10px] font-bold ${isDark ? "text-zinc-300 bg-white/[0.05]" : "text-slate-600 bg-slate-100"} px-1.5 py-0.5 rounded border ${isDark ? "border-white/10" : "border-slate-200"}`}>
                          {item.round}
                        </span>
                      )}
                      <span
                        className={`truncate text-xs font-bold ${
                          isSelected ? (isDark ? "text-white" : "text-slate-900") : isDark ? "text-zinc-200" : "text-slate-700"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    {item.description && (
                      <span className={`truncate text-[11px] mt-0.5 ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="py-12 text-center text-xs text-zinc-500">
            Nessun circuito trovato
          </div>
        )}
      </div>
    </div>
  );
}
