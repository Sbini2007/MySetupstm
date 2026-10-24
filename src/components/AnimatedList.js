"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

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
}) {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(
    initialSelectedIndex >= 0 ? initialSelectedIndex : 0
  );

  const activeIndex = selectedId
    ? items.findIndex((it) => it.id === selectedId || it.slug === selectedId)
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

  const formattedMaxHeight = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

  return (
    <div
      style={{
        width: width || "100%",
        borderRadius: radius,
      }}
      className={`relative outline-none ${
        frame
          ? "border border-white/[0.08] bg-[#0c0d14] shadow-xl"
          : "bg-transparent"
      } ${className}`}
    >
      <div
        style={{
          maxHeight: formattedMaxHeight,
          padding: frame ? "10px" : "4px",
        }}
        className={`flex flex-col gap-2 overflow-y-auto ${
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

            return (
              <button
                key={item.id || item.slug || item.title || index}
                type="button"
                onClick={() => handleSelect(item, index)}
                className={`w-full relative flex items-center justify-between text-left rounded-xl p-3 transition duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.1] border border-white/35 text-white shadow-md ring-1 ring-white/20"
                    : "border border-white/[0.07] bg-[#0c0d15] text-zinc-300 hover:border-white/20 hover:bg-[#121320] hover:text-white"
                } ${itemClassName}`}
              >
                {/* Left Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white" />
                )}

                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {/* Flag */}
                  {item.flagCode && (
                    <div className="relative h-6 w-8 shrink-0 overflow-hidden rounded border border-white/10 bg-black/40">
                      <Image
                        src={`/flags/${item.flagCode}.svg`}
                        alt=""
                        width={32}
                        height={20}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Circuit info */}
                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-2">
                      {item.round && (
                        <span className="font-mono text-[10px] font-bold text-zinc-300 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/10">
                          {item.round}
                        </span>
                      )}
                      <span
                        className={`truncate text-xs font-bold ${
                          isSelected ? "text-white" : "text-zinc-200"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    {item.description && (
                      <span className="truncate text-[11px] text-zinc-400 mt-0.5">
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
