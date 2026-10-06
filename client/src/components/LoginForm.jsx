import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { eventMap } from "@testing-library/user-event/dist/cjs/event/eventMap.js";

function LoginForm({ onSuccess }) {
    const {login} = useAuth();
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
        <section>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} onValidate>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {status && <p role="alert">{status}</p>}
        </section>
    );
}

export default LoginForm;