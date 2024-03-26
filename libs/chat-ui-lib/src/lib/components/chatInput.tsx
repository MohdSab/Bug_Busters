import React, { useState} from 'react';
import sendMessage from '../api/sendMessage';
import { Socket } from 'socket.io-client';

interface ChatInputProps {
  socket: Socket | null,
  roomCode: string,
  username: string | undefined
}

const ChatInput: React.FC<ChatInputProps> = (props) => {
  const [inputValue, setInputValue] = useState('');

  const handleMessageSend = () => {
    sendMessage(props.socket, props.roomCode, props.username, inputValue);
    setInputValue('');
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleMessageSend}>Send</button>
    </div>
  );
};

export default ChatInput;
