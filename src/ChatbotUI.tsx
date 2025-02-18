import React, { useState, useEffect, useRef } from "react";
import { AIProvider } from "./AIProvider";
import { StorageManager } from "./StorageManager";
import styled from "styled-components";

interface Message {
  user: string;
  text: string;
}

interface ChatbotProps {
  aiProvider: "openai" | "gemini" | "selfhosted";
  apiKey: string;
  backendUrl?: string;
  theme?: {
    primaryColor?: string;
    textColor?: string;
    bgColor?: string;
  };
  onMessageSend?: (message: Message) => void;
}

interface ChatContainerProps {
  open: boolean;
  theme: {
    primaryColor?: string;
    textColor?: string;
    bgColor?: string;
  };
}

/* 🟢 Mobile-First Chat Container */
const ChatContainer = styled.div<ChatContainerProps>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 85vh;
  background: ${(props) => props.theme.bgColor || "#fff"};
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

/* 🟢 Chat Header */
const ChatHeader = styled.div`
  background: ${(props) => props.theme.primaryColor || "#0084ff"};
  color: #fff;
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
  color: #fff;
  font-size: 20px;
  cursor: pointer;
`;

/* 🟢 Messages Container */
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

interface MessageBubbleProps {
  $isUser: boolean;
}

/* 🟢 Chat Bubbles */
const MessageBubble = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "$isUser",
})<MessageBubbleProps>`
  background: ${({ $isUser }) => ($isUser ? "#0084ff" : "#e4e6eb")};
  color: ${({ $isUser }) => ($isUser ? "#fff" : "#000")};
  align-self: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  padding: 10px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
  margin: 5px 0;
`;

/* 🟢 Typing Indicator */
const TypingIndicator = styled.div`
  font-style: italic;
  font-size: 14px;
  color: #666;
  padding: 5px;
`;

/* 🟢 Input Box */
const InputContainer = styled.div`
  display: flex;
  padding: 12px;
  background: #f1f1f1;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 25px;
  outline: none;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px;
  }
`;

const SendButton = styled.button`
  background: ${(props) => props.theme.primaryColor || "#0084ff"};
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 25px;
  margin-left: 5px;
  cursor: pointer;
`;

/* 🟢 Floating Chat Button */
interface ChatButtonProps {
  theme: {
    primaryColor?: string;
  };
}

const ChatButton = styled.button<ChatButtonProps>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${({ theme }) => theme.primaryColor || "#0084ff"};
  color: #fff;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10000;

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 24px;
    bottom: 15px;
    right: 15px;
  }
`;

const ChatbotUI: React.FC<ChatbotProps> = ({
  aiProvider,
  apiKey,
  backendUrl,
  theme = { primaryColor: "#0084ff", bgColor: "#fff", textColor: "#000" },
  onMessageSend,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { user: "You", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsTyping(true);

    const response = await AIProvider(
      aiProvider,
      apiKey,
      backendUrl || "",
      userInput
    );
    const botMessage: Message = { user: "Bot", text: response };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);

    if (onMessageSend) onMessageSend(botMessage);
    StorageManager.save(botMessage);
  };

  return (
    <>
      <ChatButton theme={theme} onClick={() => setIsOpen((prev) => !prev)}>
        💬
      </ChatButton>

      <ChatContainer open={isOpen} theme={theme}>
        <ChatHeader theme={theme}>
          Chat with AI
          <CloseButton onClick={() => setIsOpen(false)}>❌</CloseButton>
        </ChatHeader>

        <MessagesContainer>
          {messages.map((msg, index) => (
            <MessageBubble key={index} $isUser={msg.user === "You"}>
              {msg.text}
            </MessageBubble>
          ))}
          {isTyping && <TypingIndicator>Bot is typing...</TypingIndicator>}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <ChatInput
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <SendButton onClick={sendMessage}>➤</SendButton>
        </InputContainer>
      </ChatContainer>
    </>
  );
};

export default ChatbotUI;
