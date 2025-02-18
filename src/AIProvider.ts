export const AIProvider = async (
  provider: "openai" | "gemini" | "selfhosted",
  apiKey: string,
  backendUrl: string,
  userMessage: string
): Promise<string> => {
  let url: string;
  let headers: Record<string, string>;
  let body: string;

  if (provider === "openai") {
    url = "https://api.openai.com/v1/chat/completions";
    headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
    body = JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: userMessage }],
    });
  } else if (provider === "gemini") {
    url = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:generateText?key=${apiKey}`;
    headers = { "Content-Type": "application/json" };
    body = JSON.stringify({ prompt: userMessage });
  } else {
    url = backendUrl;
    headers = { "Content-Type": "application/json" };
    body = JSON.stringify({ input: userMessage });
  }

  const response = await fetch(url, { method: "POST", headers, body });
  const data = await response.json();
  return data.choices
    ? data.choices[0].message.content
    : data.output || "Error";
};
