import React from "react";
import styled from "styled-components";
import { ChatHeader } from "./ChatHeader";
import { MessagesContainer } from "./MessagesContainer";
import { InputContainer } from "./InputContainer";

interface ChatContainerProps {
  open: boolean;
  theme: any;
  messages: any[];
  isTyping: boolean;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  closeChat: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  open,
  theme,
  messages,
  isTyping,
  userInput,
  setUserInput,
  sendMessage,
  closeChat,
}) => {
  return (
    <Container open={open} theme={theme}>
      <ChatHeader theme={theme} closeChat={closeChat} />
      <MessagesContainer
        messages={messages}
        isTyping={isTyping}
        theme={theme}
      />
      <InputContainer
        theme={theme}
        userInput={userInput}
        setUserInput={setUserInput}
        sendMessage={sendMessage}
        isTyping={isTyping}
      />
    </Container>
  );
};

const Container = styled.div<{ open: boolean; theme: any }>`
  font-family: "DM Sans";
  position: fixed;
  bottom: ${({ open }) => (open ? "0" : "-100vh")};
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
  transition: bottom 0.5s ease-in-out; /* Smooth slide effect */
  z-index: 9999;

  @media (min-width: 768px) {
    width: 90%;
    max-width: 400px;
    height: 500px;
    bottom: ${({ open }) => (open ? "20px" : "-600px")};
    right: 20px;
    left: auto;
    border-radius: 20px;
  }
`;
