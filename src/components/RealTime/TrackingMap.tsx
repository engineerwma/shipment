'use client';

import { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation, Users } from 'lucide-react';
import { socketService } from '@/lib/socket';
import { useTranslation, type Locale } from '@/lib/i18n';

interface TrackingMapProps {
  locale: Locale;
  shipmentId?: string;
  driverId?: string;
  initialLocation?: { lat: number; lng: number };
}

export default function TrackingMap({
  locale,
  shipmentId,
  driverId,
  initialLocation,
}: TrackingMapProps) {
  const [driverLocations, setDriverLocations] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(locale);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = socketService.getSocket();

    if (!socket) return;

    // Listen for driver location updates
    socketService.onDriverLocationUpdate((data) => {
      setDriverLocations((prev) => {
        const existingIndex = prev.findIndex((d) => d.driverId === data.driverId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        }
        return [...prev, data];
      });
    });

    // Cleanup
    return () => {
      socket.off('driver:location');
    };
  }, []);

  // Simulate driver locations (replace with real data)
  useEffect(() => {
    const mockDrivers = [
      {
        driverId: '1',
        name: 'Mohamed Ahmed',
        lat: 30.0444,
        lng: 31.2357,
        status: 'active',
        vehicle: 'ABC-1234',
      },
      {
        driverId: '2',
        name: 'Ali Hassan',
        lat: 30.0488,
        lng: 31.2437,
        status: 'active',
        vehicle: 'DEF-5678',
      },
      {
        driverId: '3',
        name: 'Omar Mahmoud',
        lat: 30.0524,
        lng: 31.2397,
        status: 'offline',
        vehicle: 'GHI-9012',
      },
    ];
    setDriverLocations(mockDrivers);
  }, []);

  const centerMap = (lat: number, lng: number) => {
    // In a real app, this would center the Google Map
    console.log('Center map at:', lat, lng);
    setSelectedDriver({ lat, lng });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {locale === 'en' ? 'Live Tracking Map' : 'خريطة التتبع المباشرة'}
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{locale === 'en' ? 'Active' : 'نشط'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>{locale === 'en' ? 'Offline' : 'غير متصل'}</span>
          </div>
        </div>
      </div>

      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-96 bg-gray-100 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden"
      >
        {/* Simulated map with driver markers */}
        <div className="relative w-full h-full">
          {/* Drivers as markers */}
          {driverLocations.map((driver) => (
            <button
              key={driver.driverId}
              onClick={() => centerMap(driver.lat, driver.lng)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                driver.status === 'active' ? 'text-green-500' : 'text-gray-400'
              }`}
              style={{
                left: `${((driver.lng - 31.23) * 1000) % 100}%`,
                top: `${((driver.lat - 30.04) * 1000) % 100}%`,
              }}
            >
              <Navigation className="w-6 h-6" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-white px-2 py-1 rounded shadow-md opacity-0 hover:opacity-100 transition-opacity">
                {driver.name}
              </div>
            </button>
          ))}
        </div>

        <div className="text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <p>{locale === 'en' ? 'Map integration with Google Maps' : 'تكامل الخريطة مع خرائط جوجل'}</p>
          <p className="text-sm mt-1">
            {locale === 'en'
              ? 'Real-time tracking requires API key'
              : 'يتطلب التتبع المباشر مفتاح API'}
          </p>
        </div>
      </div>

      {/* Active drivers list */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          {locale === 'en' ? 'Active Drivers' : 'السائقون النشطون'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {driverLocations
            .filter((driver) => driver.status === 'active')
            .map((driver) => (
              <div
                key={driver.driverId}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => centerMap(driver.lat, driver.lng)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-sm text-gray-600">{driver.vehicle}</div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {locale === 'en' ? 'Active' : 'نشط'}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Lat: {driver.lat.toFixed(4)}, Lng: {driver.lng.toFixed(4)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}