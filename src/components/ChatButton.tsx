import React from "react";
import styled from "styled-components";

interface ChatButtonProps {
  open: boolean;
  theme?: {
    chatButtonBg?: string;
    chatButtonTextColor?: string;
  };
  onClick: () => void;
}

const StyledChatButton = styled.button<ChatButtonProps>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${({ theme }) => theme?.chatButtonBg || "#0084ff"};
  color: ${({ theme }) => theme?.chatButtonTextColor || "#fff"};
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  font-size: 20px;
  font-family: "Lalezar", sans-serif;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 10000;
  display: ${({ open }) => (open ? "none" : "block")};

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 18px;
    bottom: 15px;
    right: 15px;
  }
`;

export const ChatButton: React.FC<ChatButtonProps> = ({
  open,
  theme,
  onClick,
}) => {
  return (
    <StyledChatButton open={open} theme={theme} onClick={onClick}>
      🤖
    </StyledChatButton>
  );
};

export default ChatButton;
