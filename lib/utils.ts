import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateApiKey = (orgId: string) => {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const timestamp = Date.now().toString();
  const key = `${orgId}-${randomBytes}-${timestamp}`;
  return key;
};