import React from 'react';
import ChatMessages from './chatMessages';
import ChatInput from './chatInput';
import Message from '../types/message'
import { useSocket } from '@bb/socket-hook-lib';

interface ChatContainerProps {
  // empty for now
}

const ChatContainer: React.FC<ChatContainerProps> = (props) => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const { socket, loading} = useSocket();

    const handleNewMessage = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    React.useEffect(() => {
        if (loading) return;

        socket?.on('message-recieved', handleNewMessage);

        return () => {
          socket.disconnect();
        };
    }, [socket, loading]);

    return (
        <div>
            <ChatMessages messages={messages} />
            <ChatInput />
        </div>
  );
};

export default ChatContainer;
