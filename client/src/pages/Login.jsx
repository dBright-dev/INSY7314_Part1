import { useNavigate } from "react-router-dom";
import LoginForm from '../components/LoginForm';

function Login() {
    const navigate = useNavigate();
    return <LoginForm onSuccess={() => navigate('/dashboard')} />;
}

export default Login;