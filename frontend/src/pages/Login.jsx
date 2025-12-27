import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = ({ allowSignUp = true, title = 'Login', expectedRole = null }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, signUp, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // UX Delay for smoothness
            await new Promise(r => setTimeout(r, 800));

            if (isSignUp) {
                if (!allowSignUp) {
                    setError('Sign Up is disabled for this portal.');
                    setIsLoading(false);
                    return;
                }
                await signUp(email, password);
                alert('Verification email sent! Please check your inbox.');
            } else {
                await login(email, password);

                if (expectedRole) {
                    const { data: { session } } = await import('../supabaseClient').then(m => m.supabase.auth.getSession());
                    if (session) {
                        const res = await axios.post(`${API_URL}/users/sync`, {}, {
                            headers: { Authorization: `Bearer ${session.access_token}` }
                        });
                        const userRole = res.data.role;

                        if (userRole !== expectedRole) {
                            await logout();
                            throw new Error(`Access Denied. Restricted to ${expectedRole}s.`);
                        }
                    }
                }
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const isEmployeePortal = expectedRole === 'employee';

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* --- Background Motion Graphics (Floating Orbs) --- */}
            <div className="animate-float" style={{
                position: 'absolute', top: '-10%', left: '-5%',
                width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0) 70%)',
                borderRadius: '50%',
                zIndex: -1, pointerEvents: 'none'
            }}></div>

            <div className="animate-float-delayed" style={{
                position: 'absolute', bottom: '-10%', right: '-5%',
                width: '600px', height: '600px',
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(14, 165, 233, 0) 70%)',
                borderRadius: '50%',
                zIndex: -1, pointerEvents: 'none'
            }}></div>

            <div className="animate-float" style={{
                position: 'absolute', top: '40%', right: '20%',
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%)',
                borderRadius: '50%',
                zIndex: -1, pointerEvents: 'none',
                animationDuration: '15s'
            }}></div>


            {/* --- Glassmorphism Card --- */}
            <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    {/* Animated Icon/Graphic placeholder if needed, using text for now but styled */}
                    {/* Animated Clean SVG Icon (No Background Container) */}
                    <div style={{
                        width: '80px', height: '80px', margin: '0 auto 1.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {isEmployeePortal ? (
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="shieldGrad" x1="0" y1="0" x2="24" y2="24">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                                <path d="M12 2L3 7V12C3 17.52 6.84 22.74 12 24C17.16 22.74 21 17.52 21 12V7L12 2Z" fill="url(#shieldGrad)" />
                                <path d="M12 6C12.8 6 13.5 6.7 13.5 7.5V11H17C17.8 11 18.5 11.7 18.5 12.5C18.5 13.3 17.8 14 17 14H13.5V17.5C13.5 18.3 12.8 19 12 19C11.2 19 10.5 18.3 10.5 17.5V14H7C6.2 14 5.5 13.3 5.5 12.5C5.5 11.7 6.2 11 7 11H10.5V7.5C10.5 6.7 11.2 6 12 6Z" fill="white" fillOpacity="0.9" />
                            </svg>
                        ) : (
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="userGrad" x1="0" y1="0" x2="24" y2="24">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                                <circle cx="12" cy="12" r="12" fill="url(#userGrad)" fillOpacity="0.2" />
                                <circle cx="12" cy="8" r="4" fill="url(#userGrad)" />
                                <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20Z" fill="url(#userGrad)" />
                            </svg>
                        )}
                    </div>

                    <h2 className="heading-lg" style={{
                        marginBottom: '0.5rem',
                        backgroundImage: 'linear-gradient(135deg, #8b5cf6, #0ea5e9)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '2.2rem'
                    }}>
                        {isSignUp ? 'Join the Future' : title}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        {isSignUp ? 'Experience the difference' : 'Welcome back to your workspace'}
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="animate-fade-in" style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5',
                        padding: '1rem', borderRadius: '12px', marginBottom: '2rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600
                    }}>
                        <AlertTriangle size={20} /> {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="hello@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                {/* Footer Toggle */}
                {allowSignUp && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {isSignUp ? 'Already have an account?' : "New here?"}
                            <span
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-link"
                                style={{ marginLeft: '0.5rem' }}
                            >
                                {isSignUp ? 'Sign In' : 'Create Account'}
                            </span>
                        </p>
                    </div>
                )}

                {/* Portal Switching Links */}
                <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    {expectedRole === 'user' && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Internal User?{' '}
                            <span onClick={() => navigate('/login/employee')} className="text-link">
                                Employee Login &rarr;
                            </span>
                        </p>
                    )}

                    {expectedRole === 'employee' && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Customer?{' '}
                            <span onClick={() => navigate('/login')} className="text-link">
                                &larr; User Login
                            </span>
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Login;
