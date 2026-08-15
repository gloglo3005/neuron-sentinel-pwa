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

  useEffect(() => {
    citizenService
      .getAlerts()
      .then(setAlerts)
      .catch((err) => setError(err.message || 'Impossible de charger les alertes.'))
      .finally(() => setLoading(false));
  }, []);

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
          </Card>
        ))}
      </div>
    </div>
  );
}
