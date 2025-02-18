export const StorageManager = {
  save: (message: { user: string; text: string; bot: string }) => {
    let chatHistory: { user: string; text: string; bot: string }[] = JSON.parse(
      localStorage.getItem("chatHistory") || "[]"
    );
    chatHistory.push(message);
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  },

  load: (): { user: string; text: string; bot: string }[] =>
    JSON.parse(localStorage.getItem("chatHistory") || "[]"),

  saveToDatabase: async (
    endpoint: string,
    message: { user: string; text: string; bot: string }
  ) => {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  },
};
