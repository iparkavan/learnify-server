// src/modules/lecture/lecture.controller.ts
import { Request, Response } from "express";
import * as service from "../services/lecture.service";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { deleteVideoFromCloudinary } from "../config/cloudinary.config";
import { HTTPSTATUS } from "../config/http.config";

// export const createLecture = async (req: Request, res: Response) => {
//   // const lecture = await service.createLecture(req.params.sectionId, req.body);
//   // res.json(lecture);
// };

// export const updateLecture = async (req: Request, res: Response) => {
//   const lecture = await service.updateLecture(req.params.id, req.body);
//   res.json(lecture);
// };

// export const deleteLecture = async (req: Request, res: Response) => {
//   await service.deleteLecture(req.params.id);
//   res.json({ message: "Lecture deleted" });
// };

export const deleteVideoFromCloudinaryController = asyncHandler(
  async (req, res, next) => {
    const { publicId } = req.body;

    console.log("Received request to delete video with publicId:", publicId);

    if (!publicId) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ message: "publicId is required" });
    }

    const result = await deleteVideoFromCloudinary(publicId);

    if (result.result !== "ok") {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Failed to delete video",
        result,
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Video deleted successfully",
    });
  },
);
