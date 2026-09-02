"use client";

import { guides as defaultGuides, tracks as defaultTracks } from "@/lib/data";

const TRACKS_KEY = "mysetups_tracks";
const GUIDES_KEY = "mysetups_guides";
const TICKETS_KEY = "mysetups_tickets";
const USERS_KEY = "mysetups_users";

const defaultUsers = [];

const defaultTickets = [
  { id: 1, subject: "Tyre wear issue", message: "La gomma anteriore sinistra cala troppo in gara.", status: "Open", email: "driver@mysetups.local" },
  { id: 2, subject: "Setup adjustment request", message: "Serve una variante piu stabile per Monaco.", status: "Closed", email: "premium@mysetups.local" },
  { id: 3, subject: "Brake balance debugging", message: "Blocco troppo l'anteriore nelle frenate forti.", status: "Open", email: "driver@mysetups.local" },
];

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("mysetups:store"));
}

export function getTracks() {
  return read(TRACKS_KEY, defaultTracks);
}

export function saveTracks(tracks) {
  write(TRACKS_KEY, tracks);
}

export function getGuides() {
  return read(GUIDES_KEY, defaultGuides);
}

export function saveGuides(guides) {
  write(GUIDES_KEY, guides);
}

export function getTickets() {
  return read(TICKETS_KEY, defaultTickets);
}

export function saveTickets(tickets) {
  write(TICKETS_KEY, tickets);
}

export function addTicket(ticket) {
  const tickets = getTickets();
  const next = [{ id: Date.now(), status: "Open", ...ticket }, ...tickets];
  saveTickets(next);
  return next;
}

export function getUsers() {
  return read(USERS_KEY, defaultUsers);
}

export function saveUsers(users) {
  write(USERS_KEY, users);
}

export function upsertUser(user) {
  const users = getUsers();
  const existing = users.find((item) => item.email === user.email);
  const next = existing
    ? users.map((item) => (item.email === user.email ? { ...item, ...user } : item))
    : [{ id: Date.now(), premium: false, admin: false, ...user }, ...users];
  saveUsers(next);
  return next;
}

export function getUserByEmail(email) {
  return getUsers().find((user) => user.email?.toLowerCase() === email?.toLowerCase());
}
