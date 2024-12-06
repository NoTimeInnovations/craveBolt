'use client';

import { useState, useEffect } from 'react';
import { getCurrentPosition } from '@/lib/geolocation';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function getLocation() {
      try {
        const position = await getCurrentPosition();
        if (mounted) {
          setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            loading: false,
          });
        }
      } catch (error) {
        if (mounted) {
          setState({
            latitude: null,
            longitude: null,
            error: error instanceof Error ? error.message : 'Error getting location',
            loading: false,
          });
        }
      }
    }

    getLocation();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}