import React, { useState, useEffect } from "react";
import { AIProvider, StorageManager } from "./utils/index";
import { ChatContainer, ChatButton } from "./components/index";
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
    chatButtonBg?: string;
    chatButtonTextColor?: string;
    headerBg?: string;
    headerTextColor?: string;
    closeButtonColor?: string;
    userMessageBg?: string;
    userMessageText?: string;
    botMessageBg?: string;
    botMessageText?: string;
    inputContainerBg?: string;
    inputFieldBg?: string;
    inputFieldText?: string;
    sendButtonBg?: string;
    sendButtonTextColor?: string;
    typingIndicatorColor?: string;
  };
  onMessageSend?: (message: Message) => void;
  onSaveMessage?: (message: Message) => void;
}

export const ChatbotUI: React.FC<ChatbotProps> = ({
  aiProvider,
  apiKey,
  backendUrl,
  theme = {
    chatButtonBg: "#0084ff",
    chatButtonTextColor: "#fff",
    headerBg: "#0084ff",
    headerTextColor: "#fff",
    closeButtonColor: "#fff",
    userMessageBg: "#0084ff",
    userMessageText: "#fff",
    botMessageBg: "#e4e6eb",
    botMessageText: "#000",
    inputContainerBg: "#f1f1f1",
    inputFieldBg: "#fff",
    inputFieldText: "#000",
    sendButtonBg: "#0084ff",
    sendButtonTextColor: "#ffffff",
    typingIndicatorColor: "#666",
  },
  onMessageSend,
  onSaveMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => document.querySelector("input")?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!userInput.trim() || isTyping) return;

    const userMessage: Message = { user: "You", text: userInput, bot: "" };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsTyping(true);

    if (onSaveMessage) onSaveMessage(userMessage);

    const response = await AIProvider(
      aiProvider,
      apiKey,
      backendUrl || "",
      userInput
    );
    const botMessage: Message = { user: "Bot", text: response, bot: "" };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);

    if (onSaveMessage) onSaveMessage(botMessage);
    if (onMessageSend) onMessageSend(botMessage);

    StorageManager.save(botMessage);
  };

  return (
    <>
      <ChatButton open={isOpen} theme={theme} onClick={() => setIsOpen(true)} />
      <ChatContainer
        open={isOpen}
        theme={theme}
        messages={messages}
        isTyping={isTyping}
        userInput={userInput}
        setUserInput={setUserInput}
        sendMessage={sendMessage}
        closeChat={() => setIsOpen(false)}
      />
    </>
  );
};

export default ChatbotUI;
