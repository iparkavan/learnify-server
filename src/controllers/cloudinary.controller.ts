import crypto from "crypto";
import { Request, Response } from "express";

export const getCloudinarySignature = async (req: Request, res: Response) => {
  const folder = (req.query.folder as string) || "uploads";
  const timestamp = Math.round(new Date().getTime() / 1000);
  const stringToSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign)
    .digest("hex");

  res.json({
    timestamp,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
};
