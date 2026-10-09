import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav>
            <Link to="/">HustleHub+</Link>

            {!user && (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}

            {user && (
                <>
                    <Link to="/dashboard">Dashboard</Link>

                    {user.role === 'Client' && (
                        <>
                            <Link to="/browse-gigs">Browse Gigs</Link>
                            <Link to="/my-bookings">My Bookings</Link>
                        </>
                    )}

                    {user.role === 'Freelancer' && (
                        <>
                            <Link to="/my-gigs">My Gigs</Link>
                            <Link to="/income">Income</Link>
                        </>
                    )}

                    {user.role === 'Admin' && (
                        <Link to="/admin">Admin</Link>
                    )}

                    <span>Hi, {user.name}</span>
                    <button onClick={logout}>Logout</button>
                </>
            )}
        </nav>
    );
}

export default Navbar;