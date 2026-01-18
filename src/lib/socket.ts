'use client';

import { useEffect, useRef, useCallback } from 'react';

export function useSocket() {
  const socketRef = useRef<any>(null);

  const connect = useCallback((token: string) => {
    if (typeof window === 'undefined') return;

    // Dynamic import to avoid SSR issues
    import('socket.io-client').then((socketIO) => {
      const io = socketIO.default || socketIO;
      
      socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
      });
    });
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
    // Return cleanup function
    return () => {
      socketRef.current?.off(event, callback);
    };
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    emit,
    on,
    socket: socketRef.current,
  };
}