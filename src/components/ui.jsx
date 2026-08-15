const RISK_STYLES = {
  LOW: { label: 'Faible', bg: 'bg-risk-low-soft', text: 'text-risk-low' },
  MODERATE: { label: 'Modéré', bg: 'bg-risk-medium-soft', text: 'text-risk-medium' },
  HIGH: { label: 'Élevé', bg: 'bg-risk-high-soft', text: 'text-risk-high' },
  CRITICAL: { label: 'Critique', bg: 'bg-risk-critical-soft', text: 'text-risk-critical' },
};

export function RiskBadge({ level }) {
  const style = RISK_STYLES[level] || RISK_STYLES.LOW;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
      Risque {style.label}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface rounded-xl2 shadow-card border border-border p-4 ${className}`}>
      {children}
    </div>
  );
}

export function OfflineBanner({ savedAt }) {
  if (!savedAt) return null;
  const time = new Date(savedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
  return (
    <div className="bg-risk-medium-soft text-risk-medium text-sm rounded-xl2 px-4 py-3 flex items-center gap-2">
      <span>⚠️</span>
      <span>Connexion indisponible — dernières données reçues : {time}</span>
    </div>
  );
}

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      className={`w-full bg-brand text-white font-semibold rounded-xl2 py-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextInput(props) {
  return (
    <input
      className="w-full border border-border rounded-xl2 px-4 py-3 text-[15px] bg-surface-alt focus:outline-none focus:ring-2 focus:ring-brand"
      {...props}
    />
  );
}
