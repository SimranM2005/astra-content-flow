const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "groq-1";
const GROQ_ENDPOINT = import.meta.env.VITE_GROQ_ENDPOINT || `https://api.groq.ai/v1/models/${GROQ_MODEL}/outputs`;

export async function callGroqModel(prompt: string, options: Record<string, unknown> = {}) {
  if (!GROQ_API_KEY) throw new Error("GROQ API key not configured (VITE_GROQ_API_KEY)");

  const body = {
    input: prompt,
    ...options,
  };

  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Groq API error: ${res.status} ${res.statusText} - ${txt}`);
  }

  const data = await res.json();
  return data;
}
