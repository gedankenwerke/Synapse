export type ApiKeyStatus = "Active" | "Revoked";

export type ConfirmAction = "revoke" | "delete";

export interface ApiKeyData {
  id: string;
  keyName: string;
  apiKey: string;
  maskedKey: string;
  createdAt: string;
  status: ApiKeyStatus;
}


export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function maskApiKey(key: string): string {
  if (key.length <= 12) return key;
  const prefix = key.slice(0, 8);
  const suffix = key.slice(-4);
  return `${prefix}••••••••••••${suffix}`;
}

export function generateApiKey(): string {
  const chars = "0123456789abcdef";
  let result = "sk-live-";
  for (let i = 0; i < 20; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const MOCK_API_KEYS: ApiKeyData[] = [
  {
    id: "1",
    keyName: "Production API",
    apiKey: "sk-live-a1b2c3d4e5f6g7h8i9j0",
    maskedKey: "sk-live-••••••••••••i9j0",
    createdAt: "2024-01-10",
    status: "Active",
  },
  {
    id: "2",
    keyName: "Staging Environment",
    apiKey: "sk-live-k2l3m4n5o6p7q8r9s0t1",
    maskedKey: "sk-live-••••••••••••s0t1",
    createdAt: "2024-02-18",
    status: "Active",
  },
  {
    id: "3",
    keyName: "Mobile App Backend",
    apiKey: "sk-live-u3v4w5x6y7z8a9b0c1d2",
    maskedKey: "sk-live-••••••••••••c1d2",
    createdAt: "2024-03-05",
    status: "Active",
  },
  {
    id: "4",
    keyName: "Payment Gateway Integration",
    apiKey: "sk-live-e4f5g6h7i8j9k0l1m2n3",
    maskedKey: "sk-live-••••••••••••m2n3",
    createdAt: "2024-04-22",
    status: "Revoked",
  },
  {
    id: "5",
    keyName: "Analytics Service",
    apiKey: "sk-live-o5p6q7r8s9t0u1v2w3x4",
    maskedKey: "sk-live-••••••••••••w3x4",
    createdAt: "2024-05-14",
    status: "Active",
  },
  {
    id: "6",
    keyName: "Legacy System Connector",
    apiKey: "sk-live-y6z7a8b9c0d1e2f3g4h5",
    maskedKey: "sk-live-••••••••••••g4h5",
    createdAt: "2024-06-30",
    status: "Revoked",
  },
  {
    id: "7",
    keyName: "Third-Party Webhook",
    apiKey: "sk-live-i7j8k9l0m1n2o3p4q5r6",
    maskedKey: "sk-live-••••••••••••q5r6",
    createdAt: "2024-07-19",
    status: "Active",
  },
];