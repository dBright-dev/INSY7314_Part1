import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/LoginForm';
import { AuthProvider } from '../context/AuthContext';

// Mock the API helper
vi.mock('../services/api', () => ({
    apiRequest: vi.fn(),
    saveAuth: vi.fn(),
    clearAuth: vi.fn(),
    getSavedUser: () => null,
    getToken: () => null,
}));

import { apiRequest } from '../services/api';

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders email and password inputs', () => {
        render(
            <AuthProvider>
                <LoginForm />
            </AuthProvider>
        );

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('shows validation error when fields empty', async () => {
        render(
            <AuthProvider>
                <LoginForm />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        expect(await screen.findByRole('alert'))
            .toHaveTextContent(/required/i);
    });

    test('calls API on valid submit', async () => {
        apiRequest.mockResolvedValueOnce({
            data: {
                token: 'fake-token',
                user: { name: 'Test', role: 'Client', email: 'a@b.c' },
            },
        });

        render(
            <AuthProvider>
                <LoginForm />
            </AuthProvider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@b.c' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'Password123!' },
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(apiRequest).toHaveBeenCalledWith(
                '/api/auth/login',
                expect.objectContaining({ method: 'POST' })
            );
        });
    });
});