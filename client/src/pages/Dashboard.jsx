// client/src/pages/Dashboard.jsx
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <header className="topbar">
                <div>
                    <h1>Good {greeting()}, {user?.name?.split(' ')[0] || 'there'}</h1>
                    <p>Here's what's happening with your hustle.</p>
                </div>
                <button className="icon-button" aria-label="Notifications">
                    <Icon name="bell" />
                </button>
            </header>

            <section className="hero-card">
                <div className="hero-content">
                    <span className="eyebrow"><Icon name="sparkle" size={16} /> Your next chapter</span>
                    <h2>Turn what you do best into what comes next.</h2>
                    <p>Discover meaningful projects, meet brilliant collaborators, and build work you're proud of.</p>
                </div>
            </section>

            <section className="metrics-grid">
                <article className="metric-card featured">
                    <div className="metric-top">
                        <span>Signed in as</span>
                        <span className="metric-icon"><Icon name="shield" /></span>
                    </div>
                    <strong style={{ fontSize: 18 }}>{user?.email}</strong>
                    <p>Role: {user?.role}</p>
                </article>
            </section>
        </>
    );
}

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}