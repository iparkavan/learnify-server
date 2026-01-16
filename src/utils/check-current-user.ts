import { UnauthorizedException } from "./app-error";

// Custom function to validate user ID
export const checkUserId = (userId: string | undefined): boolean => {
  if (!userId) {
    throw new UnauthorizedException("Unauthorized: Invalid user ID");
  }
  return true; // userId is valid
};
