import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

const TYPES = ['Civil', 'Criminal', 'Land', 'Family', 'Succession', 'Commercial', 'Other'];
const empty = { caseNumber: '', title: '', client: '', court: '', type: 'Civil', advocate: '' };

export default function Matters() {
  const navigate = useNavigate();
  const [matters, setMatters] = useState([]);
  const [clients, setClients] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/matters', { params: { q, status } }).then((r) => setMatters(r.data));
  }, [q, status]);

  useEffect(() => {
    api.get('/clients').then((r) => setClients(r.data));
    api.get('/users/advocates').then((r) => setAdvocates(r.data));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/matters', form);
      navigate(`/matters/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the matter');
      setBusy(false);
    }
  };

  return (
    <>
      <div className="top">
        <h1>Matters</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New matter'}
        </button>
      </div>

      {showForm && (
        <form className="card" onSubmit={save}>
          <h2>New matter</h2>
          {clients.length === 0 ? (
            <p className="who">Add a client first on the <Link to="/clients">Clients</Link> page.</p>
          ) : (
            <>
              <div className="form-grid">
                <label className="field"><span>Case number</span>
                  <input value={form.caseNumber} onChange={set('caseNumber')} required /></label>
                <label className="field"><span>Title</span>
                  <input value={form.title} onChange={set('title')} required /></label>
                <label className="field"><span>Client</span>
                  <select value={form.client} onChange={set('client')} required>
                    <option value="">Choose a client</option>
                    {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select></label>
                <label className="field"><span>Court</span>
                  <input value={form.court} onChange={set('court')} /></label>
                <label className="field"><span>Type</span>
                  <select value={form.type} onChange={set('type')}>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select></label>
                <label className="field"><span>Advocate</span>
                  <select value={form.advocate} onChange={set('advocate')}>
                    <option value="">Assign to me</option>
                    {advocates.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                  </select></label>
              </div>
              {error && <p className="error">{error}</p>}
              <button className="btn" type="submit" disabled={busy}>
                {busy ? 'Saving...' : 'Save matter'}
              </button>
            </>
          )}
        </form>
      )}

      <div className="bar">
        <input placeholder="Search matters, case numbers or clients"
               value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {['All', 'Active', 'Pending', 'Closed'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Case no.</th><th>Title</th><th>Client</th><th>Status</th><th>Advocate</th></tr>
          </thead>
          <tbody>
            {matters.map((m) => (
              <tr key={m._id} className="link" tabIndex={0}
                  onClick={() => navigate(`/matters/${m._id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/matters/${m._id}`)}>
                <td>{m.caseNumber}</td>
                <td>{m.title}</td>
                <td>{m.client?.name}</td>
                <td><span className="chip">{m.status}</span></td>
                <td>{m.advocate?.name}</td>
              </tr>
            ))}
            {matters.length === 0 && (
              <tr><td colSpan={5}>No matters match. Clear the search or add a new matter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}