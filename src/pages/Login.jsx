import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton, TextInput } from '../components/ui';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(phone, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-app">
      <div className="flex flex-col items-center mb-8">
        <img src="/icons/icon-192.png" alt="Neuron Sentinel" className="w-20 h-20 rounded-xl2 mb-4" />
        <h1 className="text-xl font-bold font-display text-text-primary">Neuron Sentinel</h1>
        <p className="text-text-secondary text-sm text-center mt-1">
          Alerte inondations pour votre quartier à Lomé
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextInput
          type="tel"
          placeholder="Numéro de téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <TextInput
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-risk-high text-sm">{error}</p>}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </PrimaryButton>
      </form>

      <p className="text-center text-text-secondary text-sm mt-6">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-brand font-semibold">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
