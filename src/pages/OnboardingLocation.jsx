import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import { citizenService } from '../services/citizenService';
import { PrimaryButton } from '../components/ui';

// Spec section 6: on first use, ask for GPS permission, resolve the zone
// server-side, and never ask again on every visit afterwards.
export default function OnboardingLocation() {
  const { requestLocation, status } = useGeolocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function handleEnable() {
    setError('');
    try {
      const { latitude, longitude } = await requestLocation();
      await citizenService.updateLocation(latitude, longitude);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err.code === 1
          ? "Localisation refusée. Vous pouvez l'activer plus tard depuis votre profil."
          : err.message || 'Impossible de récupérer votre position.'
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-app text-center">
      <div className="text-5xl mb-4">📍</div>
      <h1 className="text-xl font-bold font-display text-text-primary mb-2">
        Activez votre localisation
      </h1>
      <p className="text-text-secondary text-sm mb-8 max-w-xs">
        Pour vous afficher la météo, le niveau de risque et les alertes de votre quartier,
        Neuron Sentinel a besoin de connaître votre position une seule fois.
      </p>

      {error && <p className="text-risk-high text-sm mb-4">{error}</p>}

      <div className="w-full max-w-xs flex flex-col gap-3">
        <PrimaryButton onClick={handleEnable} disabled={status === 'locating'}>
          {status === 'locating' ? 'Localisation…' : 'Activer ma localisation'}
        </PrimaryButton>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="text-text-tertiary text-sm py-2"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
