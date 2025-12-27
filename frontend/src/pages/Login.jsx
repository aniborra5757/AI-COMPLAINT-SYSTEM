import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = ({ allowSignUp = true, title = 'Login', expectedRole = null }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const { login, signUp, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isSignUp) {
                if (!allowSignUp) {
                    setError('Sign Up is disabled for this portal.');
                    return;
                }
                await signUp(email, password);
                alert('Check your email for verification link!');
            } else {
                await login(email, password);

                // Role Verification Check
                if (expectedRole) {
                    // We need to check the role immediately. 
                    // The AuthProvider does this async, so let's check via API manually here or just wait.
                    // Quicker: Check via API directly to be sure before redirecting
                    const { data: { session } } = await import('../supabaseClient').then(m => m.supabase.auth.getSession());
                    if (session) {
                        const res = await axios.post(`${API_URL}/users/sync`, {}, {
                            headers: { Authorization: `Bearer ${session.access_token}` }
                        });
                        const userRole = res.data.role;

                        if (userRole !== expectedRole) {
                            await logout(); // Kick them out
                            setError(`Access Denied. This area is for ${expectedRole}s only.`);
                            return;
                        }
                    }
                }

                // Success Redirect
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="heading" style={{ textAlign: 'center', fontSize: '2rem' }}>
                    {isSignUp ? 'Create Account' : title}
                </h2>
                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        {isSignUp ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                {allowSignUp && (
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <span
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{ color: 'var(--primary)', cursor: 'pointer', marginLeft: '0.5rem', fontWeight: 'bold' }}
                        >
                            {isSignUp ? 'Login' : 'Sign Up'}
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
