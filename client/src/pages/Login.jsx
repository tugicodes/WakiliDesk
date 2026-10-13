import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card login" onSubmit={submit}>
      <h1>WakiliDesk</h1>
      <p className="who">Sign in to your firm's workspace.</p>

      <label className="field">
        <span>Email</span>
        <input type="email" value={email} required
               onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label className="field">
        <span>Password</span>
        <input type="password" value={password} required
               onChange={(e) => setPassword(e.target.value)} />
      </label>

      {error && <p className="error">{error}</p>}

      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}