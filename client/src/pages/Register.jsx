import { useNavigate } from "react-router-dom";
import RegisterForm from '../components/RegisterForm';

function Register() {
    const navigate = useNavigate();
    return <RegisterForm onSuccess={() => navigate('/dashboard')} />;
}

export default Register;