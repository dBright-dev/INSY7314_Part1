// client/src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

const navByRole = {
    Client: [
        { to: '/dashboard', label: 'Home', icon: 'home' },
        { to: '/browse-gigs', label: 'Discover', icon: 'search' },
        { to: '/my-bookings', label: 'Bookings', icon: 'calendar' },
        { to: '/profile', label: 'Profile', icon: 'user' },
    ],
    Freelancer: [
        { to: '/dashboard', label: 'Home', icon: 'home' },
        { to: '/my-gigs', label: 'My Gigs', icon: 'briefcase' },
        { to: '/incoming-bookings', label: 'Bookings', icon: 'calendar' },
        { to: '/income', label: 'Earnings', icon: 'chart' },
        { to: '/profile', label: 'Profile', icon: 'user' },
    ],
    Admin: [
        { to: '/dashboard', label: 'Home', icon: 'home' },
        { to: '/admin/users', label: 'Users', icon: 'user' },
        { to: '/admin/gigs', label: 'Gigs', icon: 'briefcase' },
    ],
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const items = navByRole[user?.role] || navByRole.Client;
    const initials = (user?.name || '?')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <aside className="sidebar">
            <NavLink to="/dashboard" className="brand">
                <span className="brand-mark">H</span>
                <span>Hustle<span className="gold">+</span></span>
            </NavLink>

            <nav className="side-nav" aria-label="Primary navigation">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Icon name={item.icon} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pro-card">
                <span className="pro-icon"><Icon name="sparkle" size={18} /></span>
                <strong>Build your momentum</strong>
                <p>Complete your profile to get 2× more enquiries.</p>
                <NavLink to="/profile" style={{ color: 'var(--gold)', display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, fontWeight: 700 }}>
                    Complete profile <Icon name="arrow" size={16} />
                </NavLink>
            </div>

            <div className="sidebar-user">
                <span className="avatar avatar-sienna">{initials}</span>
                <span>
                    <strong>{user?.name || 'User'}</strong>
                    <small>{user?.role || 'Guest'}</small>
                </span>
                <button onClick={logout} className="row-action" aria-label="Logout">
                    <Icon name="chevron" size={17} />
                </button>
            </div>
        </aside>
    );
}