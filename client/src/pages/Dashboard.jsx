import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="card">
      <h1>Welcome, {user.name}</h1>
      <p className="who">
        You are signed in as {user.role}. Matters, deadlines, documents and billing come next.
      </p>
    </div>
  );
}