import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AuthProvider } from '../context/AuthContext';

const mockUser = (role) => {
    vi.doMock('../services/api', () => ({
        apiRequest: vi.fn(),
        saveAuth: vi.fn(),
        clearAuth: vi.fn(),
        getSavedUser: () => ({ name: 'Test User', role, email: 't@e.com' }),
        getToken: () => 'tok',
    }));
};

describe('Sidebar role-based links', () => {
    test('Freelancer sees My Gigs and Earnings', async () => {
        mockUser('Freelancer');
        vi.resetModules();
        const { default: Sidebar } = await import('../components/Sidebar');
        render(<MemoryRouter><AuthProvider><Sidebar /></AuthProvider></MemoryRouter>);
        expect(await screen.findByText(/my gigs/i)).toBeInTheDocument();
        expect(screen.getByText(/earnings/i)).toBeInTheDocument();
    });

    test('Client sees Browse Gigs and Bookings', async () => {
        mockUser('Client');
        vi.resetModules();
        const { default: Sidebar } = await import('../components/Sidebar');
        render(<MemoryRouter><AuthProvider><Sidebar /></AuthProvider></MemoryRouter>);
        expect(await screen.findByText(/discover/i)).toBeInTheDocument();
        expect(screen.getByText(/bookings/i)).toBeInTheDocument();
    });
});