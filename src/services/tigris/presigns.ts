import { envServer } from "@/data/env/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "auto",
  forcePathStyle: true,
});

export const getUploadPresignedUrl = async (fileName: string) => {
  try {
    const presignedUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: envServer.TIGRIS_STORAGE_BUCKET,
        Key: fileName,
      }),
      { expiresIn: 3600 },
    );

    return presignedUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getDeletePresignedUrl = async (fileName: string) => {
  try {
    const presignedUrl = await getSignedUrl(
      S3,
      new DeleteObjectCommand({
        Bucket: envServer.TIGRIS_STORAGE_BUCKET,
        Key: fileName,
      }),
      { expiresIn: 3600 },
    );
    return presignedUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
};
