import httpClient from "@/libs/axios";
import { PolicyCatalogItem, PolicyReloadResponse, ApiPolicyItem, mapApiPolicy } from "./types";
import { ResponseWrapper } from "@/types/response";

interface PolicyListResponse {
  policies: ApiPolicyItem[];
  policy_catalog?: ApiPolicyItem[];
}

export const policy = {
  list: async (): Promise<PolicyCatalogItem[]> => {
    const response = await httpClient.get<ResponseWrapper<PolicyListResponse>>(
      "/api/v1/policies"
    );
    const data = (response as unknown as ResponseWrapper<PolicyListResponse>).data;
    // Handle multiple response formats: { policies: [...] }, { policy_catalog: [...] }, { items: [...] }, or bare array
    const apiItems = data?.policies ?? data?.policy_catalog ?? ("items" in (data ?? {}) ? (data as any).items : undefined) ?? (Array.isArray(data) ? data as unknown as ApiPolicyItem[] : []);
    return apiItems.map(mapApiPolicy);
  },

  reload: async (): Promise<PolicyReloadResponse> => {
    const response = await httpClient.post<ResponseWrapper<PolicyReloadResponse>>(
      "/api/v1/policies/reload"
    );
    return (response as unknown as ResponseWrapper<PolicyReloadResponse>).data;
  },
};