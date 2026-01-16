import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { getEnrollmentStatusService } from "../services/enrollment.service";

// GET /api/courses/:courseId/enrollment-status
export const getEnrollmentStatusController = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { courseId } = req.params;

  if (!userId) {
    return res.json({ enrolled: false });
  }

  const { enrollment } = await getEnrollmentStatusService(userId, courseId);

  return res.status(HTTPSTATUS.OK).json({ enrolled: !!enrollment });
});
