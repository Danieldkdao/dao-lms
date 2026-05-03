"use client";

import { useConfetti } from "@/hooks/use-confetti";
import { useEffect } from "react";

export const ConfettiOnRender = () => {
  const { runConfetti } = useConfetti();
  useEffect(() => {
    runConfetti();
  }, []);

  return null;
};
