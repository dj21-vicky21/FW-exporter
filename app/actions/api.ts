"use server";

import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { decrypt } from "@/lib/store";
import {
  AgentGroup,
  RequesterGroup,
  ServiceCatalogItem,
  ServiceCategory,
  WorkspaceResponse,
  WorkspacesResponse,
} from "./apiTypes";

// Create axios instance with retry configuration
const client = axios.create();

const verifyAuth = async (
  storedData: { domain: string; apiKey: string } | null
) => {
  if (!storedData) {
    throw new Error("Unauthorized");
  }

  const { domain, apiKey } = storedData;
  const plainApiKey = decrypt(apiKey);
  const plainDomain = decrypt(domain);

  return { plainApiKey, plainDomain };
};

axiosRetry(client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 429 ||
      (error.response?.status ?? 0) >= 500
    );
  },
});

// Service Request
export async function viewServiceRequest(
  displayId: number,
  storedData: { domain: string; apiKey: string } | null
): Promise<ServiceCatalogItem> {
  const { plainApiKey, plainDomain } = await verifyAuth(storedData);

  try {
    const response = await client.get<ServiceCatalogItem>(
      `https://${plainDomain}.freshservice.com/api/v2/service_catalog/items/${displayId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(plainApiKey + ":X").toString(
            "base64"
          )}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch service request item: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

// Service Request Category
export async function viewServiceRequestCategory(
  categoryId: number,
  storedData: { domain: string; apiKey: string } | null
): Promise<ServiceCategory> {
  const { plainApiKey, plainDomain } = await verifyAuth(storedData);

  try {
    const response = await client.get<ServiceCategory>(
      `https://${plainDomain}.freshservice.com/api/v2/service_catalog/categories/${categoryId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(plainApiKey + ":X").toString(
            "base64"
          )}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch service catalog: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

// Agent group
export async function viewaAgentGroup(
  agentGroupId: number,
  storedData: { domain: string; apiKey: string } | null
): Promise<AgentGroup> {
  const { plainApiKey, plainDomain } = await verifyAuth(storedData);

  try {
    const response = await client.get<AgentGroup>(
      `https://${plainDomain}.freshservice.com/api/v2/groups/${agentGroupId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(plainApiKey + ":X").toString(
            "base64"
          )}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch Agent Group item: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

// Requester group
export async function viewaRequesterGroup(
  requesterGroupId: number,
  storedData: { domain: string; apiKey: string } | null
): Promise<RequesterGroup> {
  const { plainApiKey, plainDomain } = await verifyAuth(storedData);

  try {
    const response = await client.get<RequesterGroup>(
      `https://${plainDomain}.freshservice.com/api/v2/requester_groups/${requesterGroupId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(plainApiKey + ":X").toString(
            "base64"
          )}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch Requester Group item: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getAllWorkspaces({
  domain,
  apiKey,
}: {
  domain: string;
  apiKey: string;
}): Promise<WorkspacesResponse> {
  try {
    const response = await client.get<WorkspacesResponse>(
      `https://${domain}.freshservice.com/api/v2/workspaces`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey + ":X").toString(
            "base64"
          )}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch workspaces: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function viewWorkspace(
  workspaceId: number,
  storedData: { domain: string; apiKey: string } | null
): Promise<WorkspaceResponse> {
  const { plainApiKey, plainDomain } = await verifyAuth(storedData);

  try {
    const response = await client.get<WorkspaceResponse>(
      `https://${plainDomain}.freshservice.com/api/v2/workspaces/${workspaceId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(plainApiKey + ":X").toString(
            "base64"
          )}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch Requester Group item: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("An unexpected error occurred");
  }
}
