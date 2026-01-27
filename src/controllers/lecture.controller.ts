// src/modules/lecture/lecture.controller.ts
import { Request, Response } from "express";
import * as service from "../services/lecture.service";

export const createLecture = async (req: Request, res: Response) => {
  // const lecture = await service.createLecture(req.params.sectionId, req.body);
  // res.json(lecture);
};

export const updateLecture = async (req: Request, res: Response) => {
  const lecture = await service.updateLecture(req.params.id, req.body);
  res.json(lecture);
};

export const deleteLecture = async (req: Request, res: Response) => {
  await service.deleteLecture(req.params.id);
  res.json({ message: "Lecture deleted" });
};
