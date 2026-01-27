// src/modules/section/section.controller.ts
import { Request, Response } from "express";
import * as service from "../services/section.service";

export const createSection = async (req: Request, res: Response) => {
  const section = await service.createSection(req.params.courseId, req.body);
  res.json(section);
};

export const updateSection = async (req: Request, res: Response) => {
  const section = await service.updateSection(req.params.id, req.body);
  res.json(section);
};

export const deleteSection = async (req: Request, res: Response) => {
  await service.deleteSection(req.params.id);
  res.json({ message: "Section deleted" });
};
