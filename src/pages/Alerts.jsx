import { useEffect, useState } from 'react';
import { citizenService } from '../services/citizenService';
import { Card } from '../components/ui';

const SEVERITY_COLOR = {
  LOW: 'text-risk-low',
  MODERATE: 'text-risk-medium',
  HIGH: 'text-risk-high',
  CRITICAL: 'text-risk-critical',
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Per-alert ack state, keyed by alert id — a plain object is enough
  // here, there's never more than ~20 alerts loaded at once (see
  // listAlertsForCitizen's take: 20).
  const [acking, setAcking] = useState({});

  useEffect(() => {
    citizenService
      .getAlerts()
      .then(setAlerts)
      .catch((err) => setError(err.message || 'Impossible de charger les alertes.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAcknowledge(alertId) {
    setAcking((prev) => ({ ...prev, [alertId]: { loading: true, error: null } }));
    try {
      await citizenService.acknowledgeAlert(alertId);
      // Reflect the confirmed state from the backend's own response
      // (implicit success — the endpoint doesn't echo the alert back, so
      // we just flip the flag we know the server now agrees with).
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)));
      setAcking((prev) => ({ ...prev, [alertId]: { loading: false, error: null } }));
    } catch (err) {
      setAcking((prev) => ({ ...prev, [alertId]: { loading: false, error: err.message || 'Échec de la confirmation.' } }));
    }
  }

  return (
    <div className="min-h-screen bg-app px-4 pt-6 pb-24">
      <h1 className="font-display font-bold text-lg text-text-primary mb-4">Alertes de votre zone</h1>

      {loading && <p className="text-text-tertiary text-sm">Chargement…</p>}
      {error && <p className="text-risk-high text-sm">{error}</p>}
      {!loading && !error && alerts.length === 0 && (
        <p className="text-text-secondary text-sm">Aucune alerte pour le moment.</p>
      )}

      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold uppercase ${SEVERITY_COLOR[alert.severity] || ''}`}>
                {alert.severity}
              </span>
              <span className="text-xs text-text-tertiary">{alert.status}</span>
            </div>
            <p className="font-display font-semibold text-text-primary">{alert.title}</p>
            {alert.description && <p className="text-text-secondary text-sm mt-1">{alert.description}</p>}
            {alert.dispatchedAt && (
              <p className="text-xs text-text-tertiary mt-2">
                {new Date(alert.dispatchedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            )}

            {alert.acknowledged ? (
              <p className="text-xs text-risk-low font-semibold mt-3 flex items-center gap-1">
                ✓ Vous avez confirmé avoir vu cette alerte
              </p>
            ) : (
              <div className="mt-3">
                <button
                  onClick={() => handleAcknowledge(alert.id)}
                  disabled={acking[alert.id]?.loading}
                  className="text-xs font-semibold text-brand border border-brand rounded-lg px-3 py-1.5 disabled:opacity-50 active:scale-[0.98] transition"
                >
                  {acking[alert.id]?.loading ? 'Confirmation…' : "J'ai vu cette alerte"}
                </button>
                {acking[alert.id]?.error && (
                  <p className="text-xs text-risk-high mt-1">{acking[alert.id].error}</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
