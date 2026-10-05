"use client";

import { useEffect } from "react";
import { clearPendingPayment } from "@/lib/pending-payment";

export default function ClearPendingOnCancel() {
  useEffect(() => {
    clearPendingPayment();
  }, []);

  return null;
}
