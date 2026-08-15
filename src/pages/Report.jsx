import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import { citizenService } from '../services/citizenService';
import { PrimaryButton } from '../components/ui';

const TYPES = [
  { value: 'FLOOD', label: 'Inondation' },
  { value: 'IMPASSABLE_ROAD', label: 'Route impraticable' },
  { value: 'RISING_WATER', label: "Montée rapide de l'eau" },
  { value: 'PERSON_IN_DANGER', label: 'Personne en danger' },
  { value: 'DAMAGED_INFRASTRUCTURE', label: 'Infrastructure endommagée' },
  { value: 'OTHER', label: 'Autre' },
];

export default function Report() {
  const navigate = useNavigate();
  const { requestLocation } = useGeolocation();
  const [type, setType] = useState('FLOOD');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idle'); // idle | locating | sending | done | error
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setStatus('locating');
    try {
      const { latitude, longitude } = await requestLocation();
      setStatus('sending');
      await citizenService.createReport({ type, description, latitude, longitude });
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err.message || "Impossible d'envoyer le signalement.");
    }
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-app text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="font-display font-bold text-lg text-text-primary mb-2">Signalement envoyé</h1>
        <p className="text-text-secondary text-sm mb-6">
          Merci — votre signalement a été transmis aux autorités.
        </p>
        <PrimaryButton onClick={() => navigate('/')} className="max-w-xs">
          Retour à l'accueil
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app px-4 pt-6 pb-24">
      <h1 className="font-display font-bold text-lg text-text-primary mb-1">🚨 Signaler un danger</h1>
      <p className="text-text-secondary text-sm mb-5">
        Votre position sera envoyée avec ce signalement.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`text-sm rounded-xl2 border px-3 py-3 text-left ${
                type === t.value
                  ? 'border-brand bg-brand-soft text-brand font-semibold'
                  : 'border-border bg-surface text-text-secondary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <textarea
          className="w-full border border-border rounded-xl2 px-4 py-3 text-[15px] bg-surface-alt focus:outline-none focus:ring-2 focus:ring-brand min-h-[100px]"
          placeholder="Description (optionnel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className="text-risk-high text-sm">{error}</p>}

        <PrimaryButton type="submit" disabled={status === 'locating' || status === 'sending'}>
          {status === 'locating' && 'Localisation…'}
          {status === 'sending' && 'Envoi…'}
          {(status === 'idle' || status === 'error') && 'Envoyer le signalement'}
        </PrimaryButton>
      </form>
    </div>
  );
}
