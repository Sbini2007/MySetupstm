import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "tickets.json");

function readFile() {
  try {
    if (!fs.existsSync(FILE)) return [];
    const raw = JSON.parse(fs.readFileSync(FILE, "utf8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeFile(list) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf8");
}

export function getTicketsAll() {
  return readFile();
}

export function saveTicketsAll(list) {
  writeFile(list);
}

export function createTicket({ email, subject, message }) {
  const list = readFile();
  const ticket = {
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    email: String(email || "").toLowerCase(),
    subject: String(subject || "").trim(),
    message: String(message || "").trim(),
    status: "Open",
    createdAt: new Date().toISOString(),
    replies: [],
  };
  list.unshift(ticket);
  writeFile(list);
  return ticket;
}

export function getTicketById(id) {
  return readFile().find((t) => t.id === id) || null;
}

export function addTicketReply(id, { author, body }) {
  const list = readFile();
  const idx = list.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const reply = {
    id: `r_${Date.now()}`,
    author: author === "admin" ? "admin" : "user",
    body: String(body || "").trim(),
    at: new Date().toISOString(),
  };
  list[idx] = {
    ...list[idx],
    replies: [...(list[idx].replies || []), reply],
    status: author === "admin" ? list[idx].status : list[idx].status,
  };
  writeFile(list);
  return list[idx];
}

export function setTicketStatus(id, status) {
  const list = readFile();
  const idx = list.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], status };
  writeFile(list);
  return list[idx];
}
