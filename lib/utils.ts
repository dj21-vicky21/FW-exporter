import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAppStore } from "./store";
import { decode } from "html-entities";
import { getAllWorkspaces } from "@/app/actions/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const verifyAuth = async () => {
  const store = useAppStore.getState();
  if (!store.isAuthValid()) {
    throw new Error("Session expired or invalid");
  }
  return store.getAuth();
};

export function formatAndCapitalize(input: string) {
  return input
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (match: string) => match.toUpperCase()) // Capitalize the first letter of each word
    .trim(); // Remove leading/trailing spaces
}

export function removeHtmlTags(
  input: string | number | boolean | null | undefined
): string {
  // Convert input to string if it's not already
  const str = String(input);

  // Remove HTML tags
  const withoutTags = str.replace(/<[^>]*>/g, "");

  // Replace &nbsp; with space and decode other HTML entities
  const decoded = decode(withoutTags);

  // Replace multiple spaces with single space and trim
  return decoded.replace(/\s+/g, " ").trim();
}

export function handleCaches(id: number | string, name: string, tag?: string) {
  const store = useAppStore.getState();
  const cachedItem = store.getCachedItem(id);
  if (!cachedItem) {
    console.log("Item added");
    store.addToCache(id, name, tag);
    return name;
  } else {
    return cachedItem.name;
  }
}

export async function setupInitialAuth(domain: string, apiKey: string) {
  try {
    // First verify the credentials by trying to fetch workspaces
    const tempAuth = { domain, apiKey };
    const workspacesResponse = await getAllWorkspaces(tempAuth);

    if (workspacesResponse?.workspaces?.length > 0) {
      const store = useAppStore.getState();
      
      // Store auth first and verify it was stored
      store.setAuth(domain, apiKey);
      const authState = store.getAuth();
      if (!authState) {
        throw new Error('Failed to store authentication');
      }

      // Store workspaces
      workspacesResponse.workspaces.forEach(ws => {
        store.addToCache(ws.id, ws.name, 'workspace');
      });

      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to setup initial auth:', error);
    return false;
  }
}
