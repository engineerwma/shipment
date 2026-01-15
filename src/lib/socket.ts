'use client';

import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  constructor() {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Shipment status updates
  onShipmentUpdate(callback: (data: any) => void) {
    this.socket?.on('shipment:update', callback);
  }

  emitShipmentUpdate(shipmentId: string, status: string, location?: { lat: number; lng: number }) {
    this.socket?.emit('shipment:update', { shipmentId, status, location });
  }

  // Driver location tracking
  onDriverLocationUpdate(callback: (data: any) => void) {
    this.socket?.on('driver:location', callback);
  }

  emitDriverLocation(lat: number, lng: number) {
    this.socket?.emit('driver:location', { lat, lng });
  }

  // Notifications
  onNotification(callback: (data: any) => void) {
    this.socket?.on('notification', callback);
  }

  // Cleanup
  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = SocketService.getInstance();