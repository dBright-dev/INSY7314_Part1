import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { eventMap } from "@testing-library/user-event/dist/cjs/event/eventMap.js";

export default function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus('');

        if (!email.trim() || !password.trim()) {
            setStatus('Email and password are required.');
            return;
        }

        setLoading(true);
        try {
            const user = await login(email, password);
            setStatus('Login successful.');
            onSuccess?.(user);
        } catch (err) {
            setStatus(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="panel" style={{ maxWidth: 420, margin: '60px auto' }}>
            <span className="eyebrow plain">Welcome back</span>
            <h1 style={{ marginTop: 8 }}>Sign in to Hustle<span className="gold">+</span></h1>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>
                Continue to your dashboard.
            </p>

            <form onSubmit={handleSubmit} onValidate>
                <div>
                    <label htmlFor="email" className="field-label">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="field-label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>

                <button type="submit" disabled={loading} className="primary-button full-button">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {status && <p role="alert" className="status status-in-progress" style={{ marginTop: 14 }}>{status}</p>}

            <p style={{ marginTop: 18, fontSize: 12, textAlign: 'center', color: 'var(--muted)' }}>
                No account? <Link to="/register" style={{ color: 'var(--sapphire)' }}>Register</Link>
            </p>
        </section>
    );
}