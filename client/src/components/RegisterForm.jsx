import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function RegisterForm({ onSuccess }) {
    const {register} = useAuth();
    const [form, setEmsetFormail] = useState({
        name: '',
        email: '',
        password: '',
        comfirmPassword: '',
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const updateField = (e) =>
        setEmsetFormail({ ...form, [e.target.name]: e.target.value });

    const validate = () => {
        if (!form.name.trim()) return 'Name is required.';
        if (!form.email.trim()) return 'Email is required.';
        if (!form.password.length < 8) return 'Password must be at least 8 characters.';
        if (!form.password !== form.comfirmPassword) return 'Passwords do not match.';
        return '';
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus('');

        const err = validate();
        if (err) {
            setStatus(err);
            return;
        }

        setLoading(true);
        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password,
                role: 'Client',
            });
            setStatus('Registration successful. Please log in.');
            onSuccess?.()
        } catch (err) {
            setStatus(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} onValidate>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        value={form.name} onChange={updateField}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={updateField}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={updateField}
                    />
                </div>

                <div>
                    <label htmlFor="password">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="confirmPassword"
                        value={form.confirmPassword}
                        onChange={updateField}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'register'}
                </button>
            </form>

            {status && <p role="alert">{status}</p>}
        </section>
    );
}

export default RegisterForm;