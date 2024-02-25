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
  const [socket, setSocket] = useState<Socket | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3000/ttt'); // TODO: maybe change URL/port?

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
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);
}
