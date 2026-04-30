import { requireAdminPermission } from "@/lib/auth/permissions";
import { getDeletePresignedUrl } from "@/services/tigris/presigns";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  const { fileName }: { fileName: string } = await request.json();

  const authResult = await requireAdminPermission();
  if (!authResult.data || !authResult.result) {
    return NextResponse.json(
      { error: true, message: "You do not have permission to do this." },
      { status: 403 },
    );
  }

  const presignedUrl = await getDeletePresignedUrl(fileName);
  if (!presignedUrl) {
    return NextResponse.json({
      error: true,
      message: "Something went wrong. Failed to get presigned url.",
    });
  }

  return NextResponse.json({
    error: false,
    message: "Presigned url generated successfully!",
    data: { url: presignedUrl },
  });
};
