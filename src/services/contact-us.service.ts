// import { prisma } from "../config/prisma.config";
import { prisma } from "../lib/schema";
import { sendAutoReply, sendEmailToAdmin } from "../utils/mailer";

export const contactUsService = async (body: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) => {
  const { firstName, lastName, email, message } = body;
  console.log("dooooooo", firstName, lastName, email, message);

  const contact = await prisma.contactMessage.create({
    data: { firstName, lastName, email, message },
  });

  sendEmailToAdmin({
    firstName,
    lastName,
    email,
    message,
  }).catch(console.error);

  sendAutoReply({
    email,
    firstName,
    lastName,
  }).catch(console.error);
};
