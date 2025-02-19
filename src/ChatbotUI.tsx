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
    typingIndicatorColor?: string;
  };
  onMessageSend?: (message: Message) => void;
  onSaveMessage?: (message: Message) => void; // to store messages
}

interface ChatContainerProps {
  open: boolean;
  theme: ChatbotProps["theme"];
}

/* 🟢 Chat Container */
const ChatContainer = styled.div<ChatContainerProps>`
  font-family: "DM Sans";
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
    border-radius: 20px;
  }
`;

/* 🟢 Chat Header */
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
  box-shadow: 2px 4px 2px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme?.closeButtonColor || "#fff"};
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
`;

/* 🟢 Messages Container */
const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;

  /* Hide scrollbar for Chrome, Safari, and Edge */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;

  /* Hide scrollbar for IE, Edge */
  -ms-overflow-style: none;

  @media (min-width: 768px) {
    height: 400px;
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${({ className }) =>
    className === "user" ? "flex-end" : "flex-start"};
`;

/* 🟢 Chat Bubbles */
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

/* 🟢 Typing Indicator */
const TypingIndicator = styled.div`
  font-style: italic;
  font-size: 14px;
  color: ${({ theme }) => theme?.typingIndicatorColor || "#666"};
  padding: 5px;
`;

/* 🟢 Input Box */
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

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px;
  }
`;

const SendButton = styled.button`
  background: ${({ theme }) => theme?.sendButtonBg || "#0084ff"};
  color: ${({ theme }) => theme?.sendButtonTextColor || "#ffffff"};
  border: none;
  padding: 10px 14px;
  border-radius: 25px;
  margin-left: 5px;
  cursor: pointer;
`;

/* 🟢 Floating Chat Button */
const ChatButton = styled.button<{
  open: boolean;
  theme: ChatbotProps["theme"];
}>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${({ theme }) => theme?.chatButtonBg || "#0084ff"};
  color: ${({ theme }) => theme?.chatButtonTextColor || "#fff"};
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  font-size: 28px;
  cursor: pointer;
  font-size: 18px;
  font-family: "Lalezar";
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  display: ${({ open }) =>
    open ? "none" : "block"}; /* Hide when chat is open */

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
  onSaveMessage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // to store the user message
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

    // to store the bot response
    if (onSaveMessage) onSaveMessage(botMessage);

    if (onMessageSend) onMessageSend(botMessage);
    StorageManager.save(botMessage);
  };

  return (
    <>
      <ChatButton open={isOpen} theme={theme} onClick={() => setIsOpen(true)}>
        Bot
      </ChatButton>

      <ChatContainer open={isOpen} theme={theme}>
        <ChatHeader theme={theme}>
          Chat with AI
          <CloseButton theme={theme} onClick={() => setIsOpen(false)}>
            X
          </CloseButton>
        </ChatHeader>

        <MessagesContainer>
          {messages.map((msg, index) => (
            <MessageWrapper
              key={index}
              className={msg.user === "You" ? "user" : "bot"}
            >
              <MessageBubble
                className={msg.user === "You" ? "user" : "bot"}
                theme={theme}
              >
                {msg.text}
              </MessageBubble>
            </MessageWrapper>
          ))}
          {isTyping && (
            <TypingIndicator theme={theme}>Bot is typing...</TypingIndicator>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer theme={theme}>
          <ChatInput
            ref={inputRef}
            theme={theme}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isTyping && sendMessage()}
          />
          <SendButton theme={theme} disabled={isTyping} onClick={sendMessage}>
            ➤
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </>
  );
};

export default ChatbotUI;
