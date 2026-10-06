import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { user } = useAuth();

    return (
        <section>
            <h1>Dashboard</h1>
            <p>Welcom, {user?.name}</p>
            <p>Role: {user?.role}</p>
            <p>Email: {user?.email}</p>
        </section>
    )
}
export default Dashboard;