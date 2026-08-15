import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { citizenService } from '../services/citizenService';
import { ApiError } from '../api/client';
import { useGeolocation } from '../hooks/useGeolocation';
import { saveLastKnownZone, loadLastKnownZone } from '../offline/lastKnown';
import { Card, RiskBadge, OfflineBanner, PrimaryButton } from '../components/ui';

export default function Home() {
  const navigate = useNavigate();
  const { requestLocation, status: geoStatus } = useGeolocation();
  const [zone, setZone] = useState(null);
  const [offlineSavedAt, setOfflineSavedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsLocation, setNeedsLocation] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await citizenService.getCurrentZone();
      setZone(data);
      setOfflineSavedAt(null);
      saveLastKnownZone(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setNeedsLocation(true);
      } else {
        // Network/backend unreachable — fall back to last known data,
        // clearly labelled as such (spec section 15).
        const cached = loadLastKnownZone();
        if (cached) {
          setZone(cached.data);
          setOfflineSavedAt(cached.savedAt);
        } else {
          setError(err.message || 'Impossible de charger vos informations.');
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleEnableLocation() {
    try {
      const { latitude, longitude } = await requestLocation();
      await citizenService.updateLocation(latitude, longitude);
      setNeedsLocation(false);
      load();
    } catch (err) {
      setError(err.message || 'Impossible de récupérer votre position.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app text-text-tertiary text-sm">
        Chargement…
      </div>
    );
  }

  if (needsLocation) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-app text-center">
        <div className="text-5xl mb-4">📍</div>
        <p className="text-text-secondary text-sm mb-6 max-w-xs">
          Activez votre localisation pour voir les informations de votre quartier.
        </p>
        <PrimaryButton onClick={handleEnableLocation} disabled={geoStatus === 'locating'} className="max-w-xs">
          {geoStatus === 'locating' ? 'Localisation…' : 'Activer ma localisation'}
        </PrimaryButton>
        {error && <p className="text-risk-high text-sm mt-3">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app px-4 pt-6 pb-24">
      <header className="flex items-center gap-3 mb-5">
        <img src="/icons/icon-192.png" alt="" className="w-9 h-9 rounded-lg" />
        <h1 className="font-display font-bold text-lg text-text-primary">Neuron Sentinel</h1>
      </header>

      {offlineSavedAt && <div className="mb-4"><OfflineBanner savedAt={offlineSavedAt} /></div>}
      {error && !zone && <p className="text-risk-high text-sm mb-4">{error}</p>}

      {zone && (
        <div className="flex flex-col gap-4">
          <Card>
            <p className="text-text-secondary text-sm mb-1">📍 Votre zone</p>
            <h2 className="font-display font-bold text-xl text-text-primary mb-3">{zone.name}</h2>
            <RiskBadge level={zone.risk?.level || zone.riskLevel} />
          </Card>

          {zone.activeAlert && (
            <Card className="border-risk-high bg-risk-high-soft">
              <p className="font-bold text-risk-high mb-1">🚨 ALERTE ACTIVE</p>
              <p className="font-display font-semibold text-text-primary mb-1">{zone.activeAlert.title}</p>
              {zone.activeAlert.description && (
                <p className="text-text-secondary text-sm">{zone.activeAlert.description}</p>
              )}
            </Card>
          )}

          {zone.weather && (
            <Card>
              <p className="text-text-secondary text-sm mb-2">Conditions actuelles</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl">🌧️</p>
                  <p className="font-semibold text-text-primary">{zone.weather.rainfall} mm</p>
                  <p className="text-xs text-text-tertiary">Pluie</p>
                </div>
                <div>
                  <p className="text-2xl">🌡️</p>
                  <p className="font-semibold text-text-primary">
                    {zone.weather.temperature != null ? `${Math.round(zone.weather.temperature)}°C` : '—'}
                  </p>
                  <p className="text-xs text-text-tertiary">Température</p>
                </div>
                <div>
                  <p className="text-2xl">💧</p>
                  <p className="font-semibold text-text-primary">
                    {zone.weather.humidity != null ? `${Math.round(zone.weather.humidity)}%` : '—'}
                  </p>
                  <p className="text-xs text-text-tertiary">Humidité</p>
                </div>
              </div>
              {zone.weather.isMock && (
                <p className="text-xs text-text-tertiary mt-3">Données météo simulées (mode démo).</p>
              )}
            </Card>
          )}

          {!zone.activeAlert && (
            <Card>
              <p className="text-text-secondary text-sm">
                Aucune alerte active pour votre zone actuellement. Restez informé.
              </p>
            </Card>
          )}
        </div>
      )}

      <button
        onClick={() => navigate('/report')}
        className="fixed bottom-24 right-4 bg-risk-high text-white font-semibold rounded-full px-5 py-3 shadow-card"
      >
        🚨 Signaler
      </button>
    </div>
  );
}
