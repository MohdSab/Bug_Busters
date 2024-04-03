import { useAccount } from '@bb/auth-hook-lib';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

export interface WSContextPayload {
  loading: boolean;
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
}

interface Props extends PropsWithChildren<object> {
  host: string;
  serviceKey: string;
  path?: string;
}

export const WebsocketChatContext = createContext<WSContextPayload>({
  loading: true,
  socket: null,
  connect: () => {},
  disconnect: () => {},
});

export function useChatSocket() {
  return useContext(WebsocketChatContext);
}

/**
 *
 * @param host - the host of the socket.io server
 * @param serviceKey - the key of the service
 * @param path - the path of the resource
 * @returns Context Provider that provide the socket connected to the host and a loading state
 */
export function WebsocketChatProvider({ host, path, serviceKey, children }: Props) {
  const { account, loading: accLoading } = useAccount();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);

  const connect = () => {
    socket?.connect();
  };

  const disconnect = () => {
    socket?.disconnect();
  };

  useEffect(() => {
    if (accLoading) return;
    const socket = io(`localhost:3002`, {
      extraHeaders: {
        key: serviceKey,
      },
      query: {
        key: serviceKey,
      },
      auth: {
        uid: account?.uid,
      },
      transports: ['websocket'],
      autoConnect: false,
    });

    socket.on('connect_error', console.log);

    socket.on('connect', () => {
      console.log('Connecting as: ', socket.id);
      setSocket(socket);
      setLoading(false);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      setSocket(null);
      setLoading(false);
    });

    socket.connect();

    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [accLoading, host, path]);

  return (
    <WebsocketChatContext.Provider
      value={{
        loading,
        socket,
        connect,
        disconnect,
      }}
    >
      {children}
    </WebsocketChatContext.Provider>
  );
}
