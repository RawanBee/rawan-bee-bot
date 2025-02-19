import React from "react";
import styled from "styled-components";

interface ChatHeaderProps {
  theme: any;
  closeChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ theme, closeChat }) => {
  return (
    <Header theme={theme}>
      Bot
      <CloseButton theme={theme} onClick={closeChat}>
        X
      </CloseButton>
    </Header>
  );
};

const Header = styled.div`
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
