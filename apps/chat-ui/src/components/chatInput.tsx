import React, { useState } from 'react';

interface ChatInputProps {
  // empty for now
}

const ChatInput: React.FC<ChatInputProps> = (props) => {
  const [inputValue, setInputValue] = useState('');

  const handleMessageSend = () => {
    // emit to room here? then empty input box
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
