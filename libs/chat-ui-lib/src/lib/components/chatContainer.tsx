import React from 'react';
import ChatMessages from './chatMessages';
import ChatInput from './chatInput';
import Message from '../types/message'
import { useChatSocket } from '@bb/socket-hook-lib';
import { Socket } from 'socket.io-client';

interface ChatContainerProps {
    socket: Socket | null,
  roomCode: string,
  username: string | undefined
}

export const ChatContainer: React.FC<ChatContainerProps> = (props) => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const { socket, loading} = useChatSocket();

    const handleNewMessage = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    React.useEffect(() => {
        if (loading) return;

        socket?.on('message-recieved', handleNewMessage);

        return () => {
          socket?.disconnect();
        };
    }, [socket, loading]);

    return (
        <div>
            <ChatMessages messages={messages} />
            <ChatInput socket={props.socket} roomCode={props.roomCode} username={props.username}/>
        </div>
  );
};

