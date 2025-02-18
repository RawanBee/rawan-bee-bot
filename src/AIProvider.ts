export const AIProvider = async (
  provider: "openai" | "gemini" | "selfhosted",
  apiKey: string,
  backendUrl: string,
  userMessage: string
): Promise<string> => {
  let url: string;
  let headers: Record<string, string>;
  let body: string;

  if (provider === "selfhosted") {
    url = "http://localhost:11434/api/generate"; // Ollama API
    headers = { "Content-Type": "application/json" };
    body = JSON.stringify({ model: "mistral", prompt: userMessage });
  } else if (provider === "openai") {
    url = "https://api.openai.com/v1/chat/completions";
    headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
    body = JSON.stringify({
      model: "gpt-3.5-turbo",
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

  try {
    const response = await fetch(url, { method: "POST", headers, body });

    if (!response.body) {
      console.error("API Error: No response body");
      return "Error: No response from model";
    }

    // ✅ Handle streaming response properly
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });

      // Extract "response" field from each JSON line and concatenate
      chunk.split("\n").forEach((line) => {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);
            fullMessage += parsed.response + " ";
          } catch (error) {
            console.error("Error parsing chunk:", error);
          }
        }
      });
    }

    return fullMessage.trim();
  } catch (error) {
    console.error("Network Error:", error);
    return "Error: Failed to connect to AI provider.";
  }
};
