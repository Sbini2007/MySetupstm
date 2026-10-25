"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import logoImg from "@/assets/images/logo.png";
import "./StaggeredMenu.css";

export const StaggeredMenu = ({
  colors = ["#1a1b2b", "#5227ff", "#090a12"],
  items = [
    { label: "HOME", link: "/" },
    { label: "SETUP", link: "/setups" },
    { label: "DISCORD", link: "https://discord.gg/YzVN3ncCwR" },
    { label: "ACCOUNT", link: "/account" },
  ],
  socialItems = [
    { label: "Community Discord", link: "https://discord.gg/YzVN3ncCwR" },
    { label: "Pannello Admin", link: "/admin" },
  ],
  displaySocials = true,
  displayItemNumbering = true,
  className = "",
  accentColor = "#8b5cf6",
}) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpen((prev) => !prev);
  };

  const close = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpen(false);
  };

  return (
    <div
      className={`${className} staggered-menu-wrapper`}
      style={accentColor ? { ["--sm-accent"]: accentColor } : undefined}
    >
      {/* Trigger Button in Top Right Navbar */}
      <button
        type="button"
        className={`sm-toggle ${open ? "is-open" : ""}`}
        aria-label={open ? "Chiudi menu" : "Apri menu"}
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="sm-toggle-textWrap" aria-hidden="true">
          <span className="sm-toggle-textInner">
            <span className="sm-toggle-line">Menu</span>
            <span className="sm-toggle-line">Chiudi</span>
          </span>
        </span>
        <span className="sm-icon" aria-hidden="true">
          <span className="sm-icon-line" />
          <span className="sm-icon-line" />
          <span className="sm-icon-line" />
        </span>
      </button>

      {/* Fullscreen Overlay Portal directly into document.body */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={`sm-portal-overlay ${open ? "is-open" : ""}`}
            style={accentColor ? { ["--sm-accent"]: accentColor } : undefined}
          >
            {/* Dark Blurred Backdrop */}
            <div className="sm-backdrop" onClick={close} aria-hidden="true" />

            {/* Staggered Sliding Prelayers */}
            <div className="sm-prelayers" aria-hidden="true">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className={`sm-prelayer sm-prelayer-${i}`}
                  style={{ background: c }}
                />
              ))}
            </div>

            {/* Main Sliding Panel */}
            <aside
              id="staggered-menu-panel"
              className="staggered-menu-panel"
              aria-hidden={!open}
            >
              {/* Top bar inside sliding panel */}
              <div className="sm-panel-topbar">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-28 w-28 shrink-0">
                    <Image
                      src={logoImg}
                      alt="MySetups"
                      className="h-full w-full scale-[1.4] object-contain"
                    />
                  </div>
                  <span className="font-sans text-xs font-black tracking-tight text-white uppercase">
                    MySetups F1 26
                  </span>
                </div>

                <button
                  type="button"
                  onClick={close}
                  className="sm-panel-close-btn"
                  aria-label="Chiudi menu"
                >
                  <X size={14} />
                  <span>Chiudi</span>
                </button>
              </div>

              {/* Main Panel Content */}
              <div className="sm-panel-inner">
                {/* Exactly the 4 main items with staggered reveals */}
                <ul
                  className="sm-panel-list"
                  role="list"
                  data-numbering={displayItemNumbering || undefined}
                >
                  {items.map((it, idx) => {
                    const isExternal =
                      it.link.startsWith("http://") || it.link.startsWith("https://");
                    return (
                      <li className="sm-panel-itemWrap" key={it.label + idx}>
                        {isExternal ? (
                          <a
                            className={`sm-panel-item sm-panel-item-${idx}`}
                            href={it.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={it.label}
                            data-index={idx + 1}
                            onClick={close}
                          >
                            <span className="sm-panel-itemLabel">{it.label}</span>
                          </a>
                        ) : (
                          <Link
                            className={`sm-panel-item sm-panel-item-${idx}`}
                            href={it.link}
                            aria-label={it.label}
                            data-index={idx + 1}
                            onClick={close}
                          >
                            <span className="sm-panel-itemLabel">{it.label}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Secondary Links & Socials */}
                {displaySocials && socialItems && socialItems.length > 0 && (
                  <div className="sm-socials" aria-label="Social links">
                    <h3 className="sm-socials-title">Collegamenti Rapidi</h3>
                    <ul className="sm-socials-list" role="list">
                      {socialItems.map((s, i) => (
                        <li key={s.label + i} className="sm-socials-item">
                          {s.link.startsWith("http") ? (
                            <a
                              href={s.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sm-socials-link"
                              onClick={close}
                            >
                              {s.label}
                            </a>
                          ) : (
                            <Link
                              href={s.link}
                              className="sm-socials-link"
                              onClick={close}
                            >
                              {s.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>,
          document.body
        )}
    </div>
  );
};

export default StaggeredMenu;
