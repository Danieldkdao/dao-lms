import { NO_PERMISSION_MESSAGE } from "@/lib/auth/constants";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { getDeletePresignedUrl } from "@/services/tigris/presigns";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  const { key }: { key: string } = await request.json();

  if (!(await requireAdminPermission())) {
    return NextResponse.json(
      { error: true, message: NO_PERMISSION_MESSAGE },
      { status: 403 },
    );
  }

  const presignedUrl = await getDeletePresignedUrl(key);
  if (!presignedUrl) {
    return NextResponse.json(
      {
        error: true,
        message: "Something went wrong. Failed to get presigned url.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Presigned url generated successfully!",
    data: { url: presignedUrl },
  });
};
