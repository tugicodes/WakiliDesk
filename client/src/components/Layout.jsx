import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = {
  Admin: [['/', 'Dashboard'], ['/matters', 'Matters'], ['/clients', 'Clients'],
          ['/deadlines', 'Deadlines'], ['/documents', 'Documents'], ['/invoices', 'Invoices']],
  Advocate: [['/', 'Dashboard'], ['/matters', 'Matters'], ['/clients', 'Clients'],
             ['/deadlines', 'Deadlines'], ['/documents', 'Documents']],
  Accounts: [['/', 'Dashboard'], ['/clients', 'Clients'], ['/invoices', 'Invoices']],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="shell">
      <aside>
        <div className="brand">Wakili<i>Desk</i></div>
        <div className="nav">
          {NAV[user.role].map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}
                     className={({ isActive }) => (isActive ? 'on' : '')}>
              {label}
            </NavLink>
          ))}
        </div>
      </aside>

      <main>
        <div className="top">
          <div className="who">
            Signed in as {user.name} ({user.role})
            <button className="btn alt" onClick={signOut}>Sign out</button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}