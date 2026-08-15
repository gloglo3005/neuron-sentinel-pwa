import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton, TextInput } from '../components/ui';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, phone, password);
      navigate('/onboarding-location', { replace: true });
    } catch (err) {
      setError(err.message || 'Inscription impossible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-app">
      <div className="flex flex-col items-center mb-8">
        <img src="/icons/icon-192.png" alt="Neuron Sentinel" className="w-20 h-20 rounded-xl2 mb-4" />
        <h1 className="text-xl font-bold font-display text-text-primary">Créer un compte</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextInput placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextInput
          type="tel"
          placeholder="Numéro de téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <TextInput
          type="password"
          placeholder="Mot de passe (6 caractères min.)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        {error && <p className="text-risk-high text-sm">{error}</p>}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Création…' : 'Créer mon compte'}
        </PrimaryButton>
      </form>

      <p className="text-center text-text-secondary text-sm mt-6">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-brand font-semibold">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
