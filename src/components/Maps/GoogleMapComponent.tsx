'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from '@react-google-maps/api';
import { Navigation, Package, Clock } from 'lucide-react';
import { useTranslation, type Locale } from '@/lib/i18n';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 30.0444,
  lng: 31.2357, // Cairo coordinates
};

interface GoogleMapComponentProps {
  locale: Locale;
  drivers?: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    status: string;
    vehicle: string;
    shipments: number;
  }>;
  warehouses?: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
  }>;
  onDriverSelect?: (driver: any) => void;
}

export default function GoogleMapComponent({
  locale,
  drivers = [],
  warehouses = [],
  onDriverSelect,
}: GoogleMapComponentProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { t } = useTranslation(locale);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const calculateRoute = useCallback((origin: any, destination: any) => {
    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        }
      }
    );
  }, []);

  const handleDriverClick = (driver: any) => {
    setSelectedDriver(driver);
    if (onDriverSelect) {
      onDriverSelect(driver);
    }
  };

  const handleGetDirections = () => {
    if (selectedDriver && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const destination = {
            lat: selectedDriver.lat,
            lng: selectedDriver.lng,
          };
          calculateRoute(origin, destination);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          {locale === 'en' ? 'Google Maps API Key Required' : 'مفتاح خرائط Google مطلوب'}
        </h3>
        <p className="text-gray-600">
          {locale === 'en'
            ? 'Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.'
            : 'يرجى إضافة NEXT_PUBLIC_GOOGLE_MAPS_API_KEY إلى متغيرات البيئة.'}
        </p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      onLoad={() => setMapLoaded(true)}
    >
      <div className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {/* Warehouse markers */}
          {warehouses.map((warehouse) => (
            <Marker
              key={`warehouse-${warehouse.id}`}
              position={{ lat: warehouse.lat, lng: warehouse.lng }}
              icon={{
                url: '/warehouse-marker.png',
                scaledSize: new google.maps.Size(40, 40),
              }}
              title={warehouse.name}
            />
          ))}

          {/* Driver markers */}
          {drivers.map((driver) => (
            <Marker
              key={`driver-${driver.id}`}
              position={{ lat: driver.lat, lng: driver.lng }}
              icon={{
                url: driver.status === 'active' 
                  ? '/driver-active.png' 
                  : '/driver-inactive.png',
                scaledSize: new google.maps.Size(32, 32),
              }}
              title={driver.name}
              onClick={() => handleDriverClick(driver)}
            />
          ))}

          {/* Selected driver info window */}
          {selectedDriver && (
            <InfoWindow
              position={{ lat: selectedDriver.lat, lng: selectedDriver.lng }}
              onCloseClick={() => setSelectedDriver(null)}
            >
              <div className="p-2">
                <div className="font-medium">{selectedDriver.name}</div>
                <div className="text-sm text-gray-600">{selectedDriver.vehicle}</div>
                <div className="text-sm">
                  {locale === 'en' ? 'Shipments:' : 'الشحنات:'} {selectedDriver.shipments}
                </div>
                <button
                  onClick={handleGetDirections}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  {locale === 'en' ? 'Get Directions' : 'احصل على الاتجاهات'}
                </button>
              </div>
            </InfoWindow>
          )}

          {/* Directions */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>

        {/* Map controls */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">{locale === 'en' ? 'Active Drivers' : 'سائقون نشطون'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm">{locale === 'en' ? 'Warehouses' : 'المستودعات'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm">{locale === 'en' ? 'Inactive' : 'غير نشط'}</span>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}