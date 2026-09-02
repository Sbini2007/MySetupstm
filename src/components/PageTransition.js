"use client";

export default function PageTransition({ children }) {
  return (
    <div className="page-shell" style={{ width: "100%", minHeight: "100vh" }}>
      {children}
    </div>
  );
}