// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './pages/Dashboard';

// Placeholder pages for other members to build:
const Placeholder = ({ title }) => <h1 style={{ padding: 40 }}>{title}</h1>;

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppShell />}>
                            <Route path="/dashboard" element={<Dashboard />} />

                            {/* Member 4 will replace these placeholders */}
                            <Route path="/browse-gigs" element={<Placeholder title="Browse Gigs" />} />
                            <Route path="/my-gigs" element={<Placeholder title="My Gigs" />} />
                            <Route path="/my-bookings" element={<Placeholder title="My Bookings" />} />
                            <Route path="/incoming-bookings" element={<Placeholder title="Incoming Bookings" />} />
                            <Route path="/income" element={<Placeholder title="Income" />} />
                            <Route path="/profile" element={<Placeholder title="Profile" />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

// AppShell = Sidebar + main content area (Outlet)
import { Outlet } from 'react-router-dom';
function AppShell() {
    return (
        <div className="app-shell">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}