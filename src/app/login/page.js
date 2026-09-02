"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

function LoginInner() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reauth = searchParams.get("reauth") === "1";
  const redirectTarget = searchParams.get("redirect") || "/account";

  useEffect(() => {
    if (!reauth) return;
    const id = window.setTimeout(() => {
      const el = document.getElementById("login-google-focus");
      el?.focus();
    }, 300);
    return () => clearTimeout(id);
  }, [reauth]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace(redirectTarget);
    }
  }, [status, session, router, redirectTarget]);

  if (status === "authenticated" && session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black px-6 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_58%)]" />

      <section className="relative mx-auto flex min-h-screen max-w-md items-center justify-center pt-24">
        <div className="w-full rounded-2xl border border-violet-500/20 bg-[#111111]/90 p-8 shadow-[0_0_70px_rgba(139,92,246,0.16)]">
          <p className="text-center text-sm uppercase tracking-[0.35em] text-violet-300">MySetups</p>
          <h1 className="mt-4 text-center text-5xl font-black">Login</h1>
          <p className="mt-3 text-center text-white/54">
            Accedi con Google o Discord per i setup. Il premium si attiva dopo il pagamento PayPal sullo stesso account.
          </p>
          {reauth ? (
            <p className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-100">
              Scegli di nuovo l&apos;account Google (picker). Discord: esci anche dal sito Discord se serve cambiare utente.
            </p>
          ) : null}

          <div className="mt-10 flex flex-col gap-3">
            <button
              id="login-google-focus"
              type="button"
              onClick={() =>
                reauth
                  ? signIn("google", { callbackUrl: redirectTarget }, { prompt: "select_account" })
                  : signIn("google", { callbackUrl: redirectTarget })
              }
              className="w-full rounded-xl bg-white px-6 py-4 text-base font-black text-gray-900 transition hover:bg-white/90"
            >
              Continua con Google
            </button>
            <button
              type="button"
              onClick={() => signIn("discord", { callbackUrl: redirectTarget })}
              className="w-full rounded-xl bg-[#5865F2] px-6 py-4 text-base font-black text-white transition hover:bg-[#4752c4]"
            >
              Continua con Discord
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-white/45">
            Vuoi sbloccare tutto?{" "}
            <Link href="/checkout" className="font-semibold text-violet-300 hover:text-violet-200">
              Vai al checkout PayPal
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-white/35">
            {t("loginNow")} — sessione gestita in modo sicuro tramite OAuth.
          </p>
        </div>
      </section>
    </main>
  );
}

function LoginFallback() {
  return (
    <main className="min-h-screen bg-black px-6 text-white">
      <section className="relative mx-auto flex min-h-screen max-w-md items-center justify-center pt-24">
        <div className="w-full rounded-2xl border border-violet-500/20 bg-[#111111]/90 p-8 shadow-[0_0_70px_rgba(139,92,246,0.16)]">
          <p className="text-center text-sm uppercase tracking-[0.35em] text-violet-300">MySetups</p>
          <h1 className="mt-4 text-center text-5xl font-black">Login</h1>
          <p className="mt-3 text-center text-white/54">Caricamento in corso…</p>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginInner />
    </Suspense>
  );
}
