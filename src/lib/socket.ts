// lib/socket.ts
'use client';

// Import as default to avoid type conflicts
import socketIO from 'socket.io-client';

// Create type alias for Socket
type Socket = ReturnType<typeof socketIO>;

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  constructor() {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    this.socket = socketIO(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  getSocket() {
    return this.socket;
  }

  onDriverLocationUpdate(callback: (data: any) => void) {
    this.socket?.on('driver:location', callback);
    return () => {
      this.socket?.off('driver:location', callback);
    };
  }

  onShipmentUpdate(callback: (data: any) => void) {
    this.socket?.on('shipment:update', callback);
    return () => {
      this.socket?.off('shipment:update', callback);
    };
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = SocketService.getInstance();