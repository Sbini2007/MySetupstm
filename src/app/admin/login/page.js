import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-24">
        <div className="w-full rounded-3xl border border-white/10 bg-[#111111]/90 p-10 text-center shadow-[0_0_60px_rgba(0,0,0,0.45)]">
          <h1 className="text-4xl font-black">Admin login</h1>
          <p className="mt-4 text-white/60">
            Questa pagina è riservata all'accesso admin. Per ora usa il <a href="/login" className="text-violet-300 underline hover:text-violet-200">login utente</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
