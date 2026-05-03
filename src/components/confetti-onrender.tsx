"use client";

import { useConfetti } from "@/hooks/use-confetti";
import { useEffect } from "react";

export const ConfettiOnRender = () => {
  const { triggerConfetti } = useConfetti();
  useEffect(() => {
    triggerConfetti();
  }, []);

  return null;
};
