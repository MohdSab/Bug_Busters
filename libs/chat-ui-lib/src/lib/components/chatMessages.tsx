import React from 'react';
import { Message } from '@bb/chat-api-lib';

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  console.log("in chat history component");
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.username}</strong>:{message.message}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
