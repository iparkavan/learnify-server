import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { contactUsService } from "../services/contact-us.service";
import { contactUsSchema } from "../validations/contact-us.validation";

export const contactUsController = asyncHandler(async (req, res, next) => {
  const body = contactUsSchema.parse(req.body);
  //
  //   const {} =
  await contactUsService(body);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "Your message has been received.",
  });
});
