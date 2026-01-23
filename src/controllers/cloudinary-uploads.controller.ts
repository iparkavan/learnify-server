import { generateUploadSignature } from "../config/cloudinary.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const getUploadSignatureController = asyncHandler(async (req, res) => {
  const data = generateUploadSignature();
  res.json(data);
});
