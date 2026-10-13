import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const empty = { name: '', type: 'Individual', phone: '', email: '' };

export default function Clients() {
  const { user } = useAuth();
  const canEdit = user.role !== 'Accounts';
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.get('/clients').then((r) => setClients(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/clients', form);
      setForm(empty);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the client');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete ${c.name}?`)) return;
    try {
      await api.delete(`/clients/${c._id}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete the client');
    }
  };

  return (
    <>
      <div className="top">
        <h1>Clients</h1>
        {canEdit && (
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New client'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="card" onSubmit={save}>
          <h2>New client</h2>
          <div className="form-grid">
            <label className="field"><span>Name</span>
              <input value={form.name} onChange={set('name')} required /></label>
            <label className="field"><span>Type</span>
              <select value={form.type} onChange={set('type')}>
                <option>Individual</option><option>Company</option>
              </select></label>
            <label className="field"><span>Phone</span>
              <input value={form.phone} onChange={set('phone')} /></label>
            <label className="field"><span>Email</span>
              <input type="email" value={form.email} onChange={set('email')} /></label>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Saving...' : 'Save client'}
          </button>
        </form>
      )}

      {clients.length === 0 ? (
        <div className="card"><p className="who">No clients yet. Add the first one.</p></div>
      ) : (
        <div className="row">
          {clients.map((c) => (
            <div className="card" key={c._id}>
              <h2>{c.name}</h2>
              <span className="who">{c.type}{c.phone ? ` · ${c.phone}` : ''}</span>
              {c.email && <div className="who">{c.email}</div>}
              <p>{c.matterCount} {c.matterCount === 1 ? 'matter' : 'matters'}</p>
              {user.role === 'Admin' && c.matterCount === 0 && (
                <button className="btn alt" onClick={() => remove(c)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}