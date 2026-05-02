"use client";

import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useState } from "react";
import { toast } from "sonner";

export const EnrollCourseButton = ({ courseId }: { courseId: string }) => {
  const [loading, setLoading] = useState(false);

  const handleEnrollment = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    const {
      error,
      message,
      url,
    }: { error: true; message: string; url?: string } = await res.json();
    if (error || !url) {
      toast.error(message);
      setLoading(false);
      return;
    }

    window.location.href = url;
  };

  return (
    <Button className="w-full" disabled={loading} onClick={handleEnrollment}>
      <LoadingSwap isLoading={loading}>Enroll Now</LoadingSwap>
    </Button>
  );
};
