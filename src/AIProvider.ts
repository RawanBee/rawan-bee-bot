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
  } else {
    return "Error: Unsupported AI provider";
  }

  try {
    const response = await fetch(url, { method: "POST", headers, body });

    if (!response.body) {
      console.error("API Error: No response body");
      return "Error: No response from model";
    }

    // Handle JSON streaming correctly
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });

      // Process each JSON line separately
      chunk.split("\n").forEach((line) => {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullMessage += parsed.response + " ";
            }
            if (parsed.done) {
              return fullMessage.trim(); // Stop when done
            }
          } catch (error) {
            console.error("Error parsing JSON:", error, "Raw line:", line);
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
