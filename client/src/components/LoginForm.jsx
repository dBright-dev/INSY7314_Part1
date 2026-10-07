// client/src/components/LoginForm.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        if (!email.trim() || !password.trim()) {
            setStatus('Email and password are required.');
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
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

            <form onSubmit={handleSubmit} noValidate>
                <label className="field-label">
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                    />
                </label>

                <label className="field-label">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                <button
                    type="submit"
                    className="primary-button full-button"
                    disabled={loading}
                >
                    {loading ? 'Signing in…' : 'Sign in'}
                </button>
            </form>

            {status && <p role="alert" style={{ marginTop: 14, color: 'var(--mauve-deep)' }}>{status}</p>}

            <p style={{ marginTop: 18, fontSize: 12, textAlign: 'center' }}>
                No account? <Link to="/register">Register</Link>
            </p>
        </section>
    );
}