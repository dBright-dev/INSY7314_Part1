import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';

vi.mock('../services/api', () => ({
    apiRequest: vi.fn(),
    saveAuth: vi.fn(),
    clearAuth: vi.fn(),
    getSavedUser: () => ({ name: 'Persisted', role: 'Client', email: 'p@x.y' }),
    getToken: () => 'tok',
}));

function Consumer() {
    const { user, logout } = useAuth();
    return (
        <div>
            <span data-testid="name">{user?.name || 'none'}</span>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

describe('AuthContext', () => {
    test('rehydrates user from sessionStorage on mount', async () => {
        render(<MemoryRouter><AuthProvider><Consumer /></AuthProvider></MemoryRouter>);
        await waitFor(() => expect(screen.getByTestId('name')).toHaveTextContent('Persisted'));
    });

    test('logout clears the user', async () => {
        render(<MemoryRouter><AuthProvider><Consumer /></AuthProvider></MemoryRouter>);
        fireEvent.click(screen.getByRole('button', { name: /logout/i }));
        await waitFor(() => expect(screen.getByTestId('name')).toHaveTextContent('none'));
    });
});