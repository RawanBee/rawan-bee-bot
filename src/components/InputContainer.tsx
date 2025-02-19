import React, { useRef, useEffect } from "react";
import styled from "styled-components";

interface InputContainerProps {
  theme: any;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  isTyping: boolean;
}

export const InputContainer: React.FC<InputContainerProps> = ({
  theme,
  userInput,
  setUserInput,
  sendMessage,
  isTyping,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [userInput]);

  return (
    <Container theme={theme}>
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
    </Container>
  );
};

const Container = styled.div`
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
  color: ${({ theme }) => theme?.sendButtonTextColor || "#ffffff"};
  border: none;
  padding: 10px 14px;
  border-radius: 25px;
  margin-left: 5px;
  cursor: pointer;
`;
