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
    primaryColor?: string;
    textColor?: string;
    bgColor?: string;
  };
  onMessageSend?: (message: Message) => void;
}

const ChatContainer = styled.div<{ open: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  background: ${(props) => props.theme.bgColor || "#fff"};
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  display: ${(props) => (props.open ? "block" : "none")};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  z-index: 9999; /* Ensures it's always on top */
`;

const ChatHeader = styled.div`
  background: ${(props) => props.theme.primaryColor || "#0084ff"};
  color: #fff;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const MessagesContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  background: ${(props) => (props.isUser ? "#0084ff" : "#e4e6eb")};
  color: ${(props) => (props.isUser ? "#fff" : "#000")};
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 75%;
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  margin-bottom: 8px;
`;

const TypingIndicator = styled.div`
  font-style: italic;
  font-size: 14px;
  color: #666;
  padding: 5px;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background: #f1f1f1;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 20px;
  outline: none;
`;

const SendButton = styled.button`
  background: ${(props) => props.theme.primaryColor || "#0084ff"};
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  margin-left: 5px;
  cursor: pointer;
`;

const ChatButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${(props) => props.theme.primaryColor || "#0084ff"};
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 9999; /* Keeps it floating above everything */
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
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)}>💬</ChatButton>
      <ChatContainer open={isOpen} theme={theme}>
        <ChatHeader theme={theme}>Chat with AI</ChatHeader>
        <MessagesContainer>
          {messages.map((msg, index) => (
            <MessageBubble key={index} isUser={msg.user === "You"}>
              {msg.text}
            </MessageBubble>
          ))}
          {isTyping && <TypingIndicator>Bot is typing...</TypingIndicator>}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        <InputContainer>
          <ChatInput
            type="text"
            placeholder="Type a message..."
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
