import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, LogOut, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <BookOpen size={20} />, label: 'Subjects', path: '/subjects' },
  ];

  return (
    <nav className="glass" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1000, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '1rem 2rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <span style={{ background: 'var(--primary)', color: 'var(--bg-color)', padding: '0.3rem', borderRadius: '8px' }}>ST</span>
          SmartTrack
        </h2>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1rem', justifySelf: 'center' }}>
        {navItems.map((item, idx) => (
          <li key={idx}>
            <Link to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', color: location.pathname === item.path ? '#ffffff' : 'var(--text-secondary)', background: location.pathname === item.path ? 'var(--primary)' : 'transparent', fontWeight: location.pathname === item.path ? '500' : 'normal', textDecoration: 'none', transition: 'all 0.2s' }}>
              <span style={{ color: location.pathname === item.path ? '#ffffff' : 'inherit' }}>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
