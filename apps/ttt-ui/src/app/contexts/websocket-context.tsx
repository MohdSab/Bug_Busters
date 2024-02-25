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
}

export const WebsocketContext = createContext<WSContextPayload>({
  loading: true,
  socket: null,
});

export function useSocket() {
  return useContext(WebsocketContext);
}

export function WebsocketProvider({ children }: PropsWithChildren<{}>) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO change to configurable host
    const socket = io('http://localhost:8000', {
      autoConnect: false,
      path: '/ttt',
    }); // TODO: maybe change URL/port?

    socket.connect();

    socket.on('connect', () => {
      console.log('Connecting as: ', socket.id);
      setSocket(socket);
      setLoading(false);
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      setSocket(null);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <WebsocketContext.Provider
      value={{
        loading,
        socket,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
}
