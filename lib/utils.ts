import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getOrganisationDetails = () => {
  const orgId = localStorage.getItem("orgId");
  const orgName = localStorage.getItem("orgName");

  if (!orgId || !orgName) {
    // Define your fallback action
    return {
      orgId: null,
      orgName: null,
      error: "Organisation details are missing. Please visit the dashboard to set them.",
    };
  }

  return { orgId, orgName };
};