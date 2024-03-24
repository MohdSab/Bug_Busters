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

export const WebsocketContext = createContext<WSContextPayload>({
  loading: true,
  socket: null,
  connect: () => {},
  disconnect: () => {},
});

export function useSocket() {
  return useContext(WebsocketContext);
}

interface Props extends PropsWithChildren<object> {
  host: string;
  path?: string;
}

/**
 *
 * @param host - the host of the socket.io server
 * @param path - the path of the socket gateway on the host
 * @returns Context Provider that provide the socket connected to the host and a loading state
 */
export function WebsocketProvider({ host, path, children }: Props) {
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
    const socket = io({
      host,
      path,
      auth: {
        uid: account?.uid,
      },
      autoConnect: false,
    });

    socket.connect();

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

    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [accLoading, host, path]);

  return (
    <WebsocketContext.Provider
      value={{
        loading,
        socket,
        connect,
        disconnect,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
}