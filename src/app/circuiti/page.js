"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CircuitiPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/setups");
  }, [router]);

  return null;
}
