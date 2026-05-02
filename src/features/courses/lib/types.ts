export type PresignedUrlResponse = {
  error: boolean;
  message: string;
  data?: {
    url?: string;
  };
};
