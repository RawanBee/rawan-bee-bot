import React, { useState, ReactElement } from "react";
import { AIProvider } from "./AIProvider";
import { StorageManager } from "./StorageManager";

interface Message {
  user: string;
  text: string;
  bot: string;
}

interface ChatbotProps {
  aiProvider: "openai" | "gemini" | "selfhosted";
  apiKey: string;
  backendUrl?: string;
  theme?: {
    bgColor?: string;
  };
  onMessageSend?: (message: Message) => void;
}

const ChatbotUI: React.FC<ChatbotProps> = ({
  aiProvider,
  apiKey,
  backendUrl,
  theme = { bgColor: "#fff" },
  onMessageSend,
}): ReactElement => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const response = await AIProvider(
      aiProvider,
      apiKey,
      backendUrl || "",
      text
    );
    const newMessage: Message = { user: "You", text, bot: response };

    setMessages([...messages, newMessage]);

    if (onMessageSend) onMessageSend(newMessage);
    StorageManager.save(newMessage);
  };

  return (
    <div
      style={{
        backgroundColor: theme.bgColor,
        padding: 20,
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      {messages.map((msg, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <p>
            <strong>{msg.user}:</strong> {msg.text}
          </p>
          <p>
            <strong>Bot:</strong> {msg.bot}
          </p>
        </div>
      ))}
      <input
        type="text"
        placeholder="Type a message..."
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginTop: "10px",
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            sendMessage((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = ""; 
          }
        }}
      />
    </div>
  );
};

export default ChatbotUI;
