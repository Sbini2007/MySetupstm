"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * @param {boolean} [props.requirePremium] - if true, user must have premium or admin access
 */
export default function AuthGate({ children, requirePremium = false }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    setReady(true);
  }, [status]);

  useEffect(() => {
    if (!ready || status !== "unauthenticated") return;
    router.replace("/login");
  }, [ready, status, router]);

  if (!ready || status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-20 text-white">
        <div className="max-w-xl rounded-4xl border border-white/10 bg-[#111111]/95 p-10 text-center shadow-[0_0_60px_rgba(0,0,0,0.4)]">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Loading</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (requirePremium && !session?.user?.premium && !session?.user?.admin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-20 text-white">
        <div className="max-w-xl rounded-4xl border border-white/10 bg-[#111111]/95 p-10 text-center shadow-[0_0_60px_rgba(0,0,0,0.4)]">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Premium required</p>
          <h1 className="mt-6 text-3xl font-semibold text-white">Unlock full access</h1>
          <p className="mt-4 text-white/60">Complete the one-time PayPal checkout to link premium to your account.</p>
          <a
            href="/checkout"
            className="mt-8 inline-flex rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-violet-400"
          >
            Pay with PayPal
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
