import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Matters from './pages/Matters';
import MatterDetail from './pages/MatterDetail';

// Temporary page until each screen is built
const Soon = ({ title }) => (
  <div className="card">
    <h1>{title}</h1>
    <p className="who">This page is built in a later week.</p>
  </div>
);

const guard = (roles, element) => <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/matters" element={guard(['Admin', 'Advocate'], <Matters />)} />
        <Route path="/matters/:id" element={guard(['Admin', 'Advocate'], <MatterDetail />)} />
        <Route path="/clients" element={guard(['Admin', 'Advocate', 'Accounts'], <Clients />)} />
        <Route path="/deadlines" element={guard(['Admin', 'Advocate'], <Soon title="Deadlines" />)} />
        <Route path="/documents" element={guard(['Admin', 'Advocate'], <Soon title="Documents" />)} />
        <Route path="/invoices" element={guard(['Admin', 'Accounts'], <Soon title="Invoices" />)} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}