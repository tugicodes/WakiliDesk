import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';

export default function MatterDetail() {
  const { id } = useParams();
  const [matter, setMatter] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/matters/${id}`)
      .then((r) => setMatter(r.data))
      .catch(() => setError('Matter not found'));
  }, [id]);

  const changeStatus = async (e) => {
    const { data } = await api.put(`/matters/${id}`, { status: e.target.value });
    setMatter({ ...matter, status: data.status });
  };

  if (error) {
    return (
      <div className="card">
        <p className="error">{error}</p>
        <Link className="btn alt" to="/matters">Back to matters</Link>
      </div>
    );
  }
  if (!matter) return <p className="who">Loading...</p>;

  return (
    <>
      <Link className="btn alt" to="/matters">Back to matters</Link>
      <h1 style={{ marginTop: '1rem' }}>{matter.title}</h1>

      <div className="card kv">
        <div><span>Case number</span>{matter.caseNumber}</div>
        <div><span>Client</span>{matter.client?.name}</div>
        <div><span>Court</span>{matter.court || '-'}</div>
        <div><span>Type</span>{matter.type}</div>
        <div><span>Advocate</span>{matter.advocate?.name}</div>
        <div>
          <span>Status</span>
          <select value={matter.status} onChange={changeStatus}>
            <option>Active</option><option>Pending</option><option>Closed</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h2>Deadlines, documents and billing</h2>
        <p className="who">These sections are added in the next weeks.</p>
      </div>
    </>
  );
}