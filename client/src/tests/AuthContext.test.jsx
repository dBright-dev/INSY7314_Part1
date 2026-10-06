import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

vi.mock('../services/api', () => ({
    apiRequest: vi.fn(),
    saveAuth: vi.fn(),
    clearAuth: vi.fn(),
    getSavedUser: () => null,
}));

function TestConsumer() {
    const { user, login, logout } = useAuth();
    return (
        <div>
            <span data-testid="user">{user ? user.email : 'none'}</span>
            <button onClick={() => login('a@b.c', 'Password123!')}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

describe('AuthContext', () => {
    test('starts with no user', () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );
        expect(screen.getByTestId('user')).toHaveTextContent('none');
    });
});