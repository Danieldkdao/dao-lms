import { requireAdminPermission } from "@/lib/auth/permissions";
import { getUploadPresignedUrl } from "@/services/tigris/presigns";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { key }: { key: string } = await request.json();

  const authResult = await requireAdminPermission();
  if (!authResult.data || !authResult.result) {
    return NextResponse.json(
      { error: true, message: "You do not have permission to do this." },
      { status: 403 },
    );
  }

  const presignedUrl = await getUploadPresignedUrl(key);
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
