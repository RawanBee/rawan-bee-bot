import React from "react";
import styled from "styled-components";

interface MessagesContainerProps {
  messages: any[];
  isTyping: boolean;
  theme: any;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({
  messages,
  isTyping,
  theme,
}) => {
  return (
    <Container>
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
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${({ className }) =>
    className === "user" ? "flex-end" : "flex-start"};
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

const TypingIndicator = styled.div`
  font-style: italic;
  font-size: 14px;
  color: ${({ theme }) => theme?.typingIndicatorColor || "#666"};
  padding: 5px;
`;
