import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Temporary page until each screen is built
const Soon = ({ title }) => (
  <div className="card">
    <h1>{title}</h1>
    <p className="who">This page is built in a later week.</p>
  </div>
);

const guard = (roles, title) => (
  <ProtectedRoute roles={roles}><Soon title={title} /></ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/matters" element={guard(['Admin', 'Advocate'], 'Matters')} />
        <Route path="/clients" element={guard(['Admin', 'Advocate', 'Accounts'], 'Clients')} />
        <Route path="/deadlines" element={guard(['Admin', 'Advocate'], 'Deadlines')} />
        <Route path="/documents" element={guard(['Admin', 'Advocate'], 'Documents')} />
        <Route path="/invoices" element={guard(['Admin', 'Accounts'], 'Invoices')} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}