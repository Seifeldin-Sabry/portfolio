/**
 * Cloudflare Workers AI embeddings via REST — no provider SDK, works in
 * Node (CI embed script) and on Cloudflare Workers (query-time) alike.
 * Model: @cf/baai/bge-base-en-v1.5 → 768 dimensions.
 */
export const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";
export const EMBEDDING_DIM = 768;

interface CfEmbeddingResponse {
  success: boolean;
  errors?: { message: string }[];
  result?: { data: number[][] };
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN not set");
  }

  const out: number[][] = [];
  const BATCH = 90; // CF caps batch at 100 inputs
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH);
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${EMBEDDING_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: batch }),
      },
    );
    if (!res.ok) {
      throw new Error(`workers-ai embeddings failed: ${res.status} ${await res.text()}`);
    }
    const json = (await res.json()) as CfEmbeddingResponse;
    if (!json.success || !json.result?.data) {
      throw new Error(`workers-ai embeddings error: ${JSON.stringify(json.errors)}`);
    }
    out.push(...json.result.data);
  }
  return out;
}

export async function embedText(text: string): Promise<number[]> {
  const [v] = await embedTexts([text]);
  return v;
}

/** pgvector literal, e.g. '[0.1,0.2,...]' */
export function toVectorLiteral(v: number[]): string {
  return `[${v.join(",")}]`;
}
