import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { citizenService } from '../services/citizenService';
import { Card, PrimaryButton } from '../components/ui';

export default function Profile() {
  const { user, logout } = useAuth();
  const { requestLocation, status } = useGeolocation();
  const [message, setMessage] = useState('');

  async function handleRefreshLocation() {
    setMessage('');
    try {
      const { latitude, longitude } = await requestLocation();
      const res = await citizenService.updateLocation(latitude, longitude);
      setMessage(`Zone mise à jour : ${res.zoneName}`);
    } catch (err) {
      setMessage(err.message || 'Impossible de mettre à jour votre position.');
    }
  }

  return (
    <div className="min-h-screen bg-app px-4 pt-6 pb-24">
      <h1 className="font-display font-bold text-lg text-text-primary mb-4">Mon profil</h1>

      <Card className="mb-4">
        <p className="font-semibold text-text-primary">{user?.name}</p>
        <p className="text-text-secondary text-sm">{user?.phone}</p>
      </Card>

      <div className="flex flex-col gap-3">
        <PrimaryButton onClick={handleRefreshLocation} disabled={status === 'locating'} className="bg-surface !text-brand border border-brand">
          {status === 'locating' ? 'Localisation…' : '📍 Actualiser ma localisation'}
        </PrimaryButton>
        {message && <p className="text-text-secondary text-sm text-center">{message}</p>}

        <button onClick={logout} className="text-risk-high text-sm font-semibold py-2">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
