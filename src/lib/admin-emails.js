/** Emails that always receive admin access (server + client). */
export const ADMIN_EMAILS = [
  "diegocruciani256@gmail.com",
  "diegocruciani40@gmail.com",
  "admin@mysetups.local",
];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(String(email).toLowerCase());
}
