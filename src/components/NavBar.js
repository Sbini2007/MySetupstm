"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ArrowUpRight,
  Home,
  Sliders,
  MessageSquare,
} from "lucide-react";
import logoImg from "@/assets/images/logo.png";
import { useAuth } from "@/lib/client-auth";
import "./StaggeredMenu.css";

export default function NavBar() {
  const { user, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape closes the open menu.
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Lock body scroll only when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Support custom toggle events
  useEffect(() => {
    const onToggleEvent = () => setMenuOpen((prev) => !prev);
    window.addEventListener("mysetups_toggle_menu", onToggleEvent);
    return () => window.removeEventListener("mysetups_toggle_menu", onToggleEvent);
  }, []);

  const navItems = [
    { label: "Home", href: "/", isExternal: false },
    { label: "Setup", href: "/setups", isExternal: false },
    { label: "Discord", href: "https://discord.gg/YzVN3ncCwR", isExternal: true },
    { label: "Account", href: "/account", isExternal: false },
    ...(isAdmin ? [{ label: "Admin", href: "/admin", isExternal: false }] : []),
  ];

  return (
    <>
      {/* ================= FIXED NAVBAR ================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#090a12]/95 backdrop-blur-md border-b border-violet-400/[0.12] shadow-xl shadow-violet-950/10 py-0"
            : "bg-[#090a12]/85 backdrop-blur-sm border-b border-violet-400/[0.08] py-1.5"
        }`}
      >
        <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-[5.5rem] w-[5.5rem] transition-transform duration-200 group-hover:scale-105">
                <Image
                  src={logoImg}
                  alt="MySetups"
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
            </Link>

          </div>

          {/* Desktop Navigation Links */}
          <nav className="ml-auto mr-8 hidden items-center gap-10 text-xs font-bold tracking-wider text-zinc-300 lg:flex">
            <Link
              href="/"
              className="hover:text-violet-400 transition duration-150 py-1"
            >
              HOME
            </Link>
            <Link
              href="/setups"
              className="hover:text-violet-400 transition duration-150 py-1"
            >
              SETUP
            </Link>
            <a
              href="https://discord.gg/YzVN3ncCwR"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-violet-400 transition duration-150 py-1"
            >
              <span>DISCORD</span>
              <ArrowUpRight size={12} />
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Account Action */}
            {mounted && !user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login?mode=register"
                  className="rounded-xl bg-gradient-to-r from-[#5227ff] to-[#8b5cf6] px-3.5 py-1.5 text-xs font-bold text-white transition hover:brightness-110 shadow-lg shadow-violet-950/30 cursor-pointer"
                >
                  Iscriviti
                </Link>
              </div>
            ) : null}

            {/* Staggered Menu Toggle Button (.sm-toggle) */}
            <button
              id="main-sm-toggle"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className={`sm-toggle ${menuOpen ? "is-open" : ""}`}
              aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
              aria-expanded={menuOpen}
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
          </div>
        </div>
      </header>

      {/* ================= STAGGERED MENU OVERLAY (ONLY MOUNTED WHEN OPEN) ================= */}
      {mounted &&
        menuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sm-portal-overlay is-open"
            style={{ ["--sm-accent"]: "#8b5cf6" }}
          >
            {/* Backdrop Blur Overlay */}
            <div
              className="sm-backdrop"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Staggered Sliding Prelayers */}
            <div className="sm-prelayers" aria-hidden="true">
              <div
                className="sm-prelayer sm-prelayer-0"
                style={{ background: "#151828" }}
              />
              <div
                className="sm-prelayer sm-prelayer-1"
                style={{ background: "#10121d" }}
              />
              <div
                className="sm-prelayer sm-prelayer-2"
                style={{ background: "#090a12" }}
              />
            </div>

            {/* Staggered Menu Panel */}
            <aside
              id="staggered-menu-panel"
              className="staggered-menu-panel"
              role="dialog"
              aria-label="Menu di navigazione"
            >
              {/* Top bar inside sliding panel */}
              <div className="sm-panel-topbar">
                <div className="flex items-center gap-2.5">
                  <div className="h-14 w-14 relative">
                    <Image
                      src={logoImg}
                      alt="MySetups"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="sm-panel-close-btn"
                  aria-label="Chiudi menu"
                >
                  <X size={14} />
                  <span>Chiudi</span>
                </button>
              </div>

              {/* Main Panel Content */}
              <div className="sm-panel-inner">
                {/* Main Items with Numbering */}
                <ul className="sm-panel-list" data-numbering>
                  {navItems.map((item, idx) => (
                    <li key={item.label} className="sm-panel-itemWrap">
                      {item.isExternal ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMenuOpen(false)}
                          className={`sm-panel-item sm-panel-item-${idx}`}
                        >
                          <span className="sm-panel-itemLabel">{item.label}</span>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`sm-panel-item sm-panel-item-${idx}`}
                        >
                          <span className="sm-panel-itemLabel">{item.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Secondary Quick Links */}
                <div className="sm-socials" aria-label="Collegamenti Rapidi">
                  <h3 className="sm-socials-title">Collegamenti Rapidi</h3>
                  <ul className="sm-socials-list" role="list">
                    <li className="sm-socials-item">
                      <a
                        href="https://discord.gg/YzVN3ncCwR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        Community Discord
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}

    </>
  );
}
