import { useCallback, useState } from 'react';

// One-shot GPS request, called explicitly (first launch, or a manual
// "refresh my location" button) — never a continuous watch (spec section
// 16: la géolocalisation ne doit pas être demandée continuellement).
export function useGeolocation() {
  const [status, setStatus] = useState('idle'); // idle | locating | granted | denied | error

  const requestLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setStatus('error');
        reject(new Error("La géolocalisation n'est pas disponible sur cet appareil."));
        return;
      }
      setStatus('locating');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setStatus('granted');
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        },
        (err) => {
          setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error');
          reject(err);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60_000 }
      );
    });
  }, []);

  return { status, requestLocation };
}
