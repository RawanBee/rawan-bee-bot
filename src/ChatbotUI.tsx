import React, { useState, useEffect, useRef } from "react";
import { AIProvider } from "./AIProvider";
import { StorageManager } from "./StorageManager";
import styled from "styled-components";

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
  };
  onMessageSend?: (message: Message) => void;
}

interface ChatContainerProps {
  open: boolean;
  theme: ChatbotProps["theme"];
}

/* 🟢 Chat Container */
const ChatContainer = styled.div<ChatContainerProps>`
  font-family: "DM Sans", sans-serif;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 85vh;
  background: ${({ theme }) => theme?.headerBg || "#fff"};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.2);
  display: ${({ open }) => (open ? "flex" : "none")};
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  z-index: 9999;
  @media (min-width: 768px) {
    width: 90%;
    max-width: 400px;
    height: 500px;
    bottom: 20px;
    right: 20px;
    left: auto;
  }
`;

const ChatHeader = styled.div`
  background: ${({ theme }) => theme?.headerBg || "#0084ff"};
  color: ${({ theme }) => theme?.headerTextColor || "#fff"};
  padding: 14px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme?.closeButtonColor || "#fff"};
  font-size: 22px;
  cursor: pointer;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    height: 400px;
  }
`;

const MessageBubble = styled.div`
  background: ${({ className, theme }) =>
    className === "user"
      ? theme?.userMessageBg || "#0084ff"
      : theme?.botMessageBg || "#e4e6eb"};
  color: ${({ className, theme }) =>
    className === "user"
      ? theme?.userMessageText || "#fff"
      : theme?.botMessageText || "#000"};
  padding: 10px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
  margin: 5px 0;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 12px;
  background: ${({ theme }) => theme?.inputContainerBg || "#f1f1f1"};
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 25px;
  outline: none;
  font-size: 16px;
  background: ${({ theme }) => theme?.inputFieldBg || "#fff"};
  color: ${({ theme }) => theme?.inputFieldText || "#000"};
`;

const SendButton = styled.button`
  background: ${({ theme }) => theme?.sendButtonBg || "#0084ff"};
  color: ${({ theme }) => theme?.sendButtonTextColor || "#fff"};
  border: none;
  padding: 12px 16px;
  border-radius: 25px;
  margin-left: 5px;
  cursor: pointer;
  font-size: 18px;
`;

const ChatbotUI: React.FC<ChatbotProps> = ({
  aiProvider,
  apiKey,
  backendUrl,
  theme = {},
  onMessageSend,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { user: "You", text: userInput, bot: "" };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsTyping(true);

    const response = await AIProvider(
      aiProvider,
      apiKey,
      backendUrl || "",
      userInput
    );
    const botMessage: Message = { user: "Bot", text: response, bot: "" };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);

    if (onMessageSend) onMessageSend(botMessage);
    StorageManager.save(botMessage);
  };

  return (
    <ChatContainer open={isOpen} theme={theme}>
      <ChatHeader theme={theme}>
        Chat with AI
        <CloseButton theme={theme} onClick={() => setIsOpen(false)}>
          X
        </CloseButton>
      </ChatHeader>
      <MessagesContainer ref={messagesEndRef}></MessagesContainer>
      <InputContainer theme={theme}>
        <ChatInput
          ref={inputRef}
          theme={theme}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <SendButton theme={theme} onClick={sendMessage}>
          ➤
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatbotUI;
