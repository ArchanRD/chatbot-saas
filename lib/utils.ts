import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOrganisationDetails = () => {
  const orgId = localStorage.getItem("orgId");
  const orgName = localStorage.getItem("orgName");

  if (!orgId || !orgName) {
    // Define your fallback action
    return {
      orgId: null,
      orgName: null,
      error:
        "Organisation details are missing. Please visit the dashboard to set them.",
    };
  }

  return { orgId, orgName };
};

export const generateApiKey = (orgId: string) => {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const timestamp = Date.now().toString();
  const key = `${orgId}-${randomBytes}-${timestamp}`;
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  return hash;
};
