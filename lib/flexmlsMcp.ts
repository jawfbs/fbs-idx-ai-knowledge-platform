const MCP_ENDPOINT = process.env.FLEXMLS_MCP_URL || "https://mcp.flexmls.com/mcp";

type JsonRpcResponse<T> = {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: { code: number; message: string; data?: unknown };
};

export type FlexmlsHelpAnswer = {
  answer: string;
  sources: Array<{ title: string; url: string }>;
  followUps: string[];
  raw?: unknown;
};

function extractText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const result = value as { content?: Array<{ type?: string; text?: string }> };
  return (result.content || [])
    .filter((item) => item.type === "text" && item.text)
    .map((item) => item.text)
    .join("\n\n")
    .trim();
}

function parseLinks(text: string) {
  const matches = [...text.matchAll(/https?:\/\/[^\s)\]]+/g)];
  return [...new Set(matches.map((match) => match[0].replace(/[.,;:]$/, "")))].map((url) => ({
    title: new URL(url).hostname,
    url,
  }));
}

export async function askFlexmlsHelp(question: string, accessToken?: string): Promise<FlexmlsHelpAnswer> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  };
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;

  const response = await fetch(MCP_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "FlexmlsHelp",
        arguments: { query: question },
      },
    }),
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    const error = new Error("Flexmls authorization is required.") as Error & { code?: string; authenticate?: string | null };
    error.code = "FLEXMLS_AUTH_REQUIRED";
    error.authenticate = response.headers.get("www-authenticate");
    throw error;
  }

  if (!response.ok) {
    throw new Error(`Flexmls MCP request failed with status ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") || "";
  const payloadText = await response.text();
  const jsonText = contentType.includes("text/event-stream")
    ? payloadText.split("\n").find((line) => line.startsWith("data:"))?.slice(5).trim() || ""
    : payloadText;
  const payload = JSON.parse(jsonText) as JsonRpcResponse<unknown>;
  if (payload.error) throw new Error(payload.error.message);

  const answer = extractText(payload.result) || "Flexmls returned a response without displayable text.";
  return {
    answer,
    sources: parseLinks(answer),
    followUps: [
      "Where is this setting located in Flexmls?",
      "What permissions are required?",
      "Create a customer-ready support response.",
    ],
    raw: payload.result,
  };
}
