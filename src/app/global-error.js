"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="it">
      <body style={{ backgroundColor: "#07070a", color: "#fff", padding: "2rem", fontFamily: "sans-serif" }}>
        <h2>Si è verificato un errore di caricamento</h2>
        <button
          onClick={() => reset()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "#fff",
            color: "#000",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Ricarica
        </button>
      </body>
    </html>
  );
}
