import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { studentProfileSetupService } from "../services/profile-setup.service";
import { StudentProfileSetupValidation } from "../validations/profile-setup.validation";

const studentProfileSetupController = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;

  const body = StudentProfileSetupValidation.parse(req.body);

  const studentProfile = await studentProfileSetupService(body, userId);

  return res
    .status(HTTPSTATUS.OK)
    .json({ message: "Student profile setup successful", studentProfile });
});

export { studentProfileSetupController };
