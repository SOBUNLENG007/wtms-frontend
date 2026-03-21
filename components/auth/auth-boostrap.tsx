"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-store";

export function AuthBootstrap() {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return null;
}