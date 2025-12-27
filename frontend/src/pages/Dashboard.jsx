import { useEffect, useState } from 'react';
import { getComplaints } from '../api/backend';
import ComplaintForm from '../components/ComplaintForm';
import { useAuth } from '../components/AuthProvider';
import { LogOut, Plus, List, Search } from 'lucide-react';

const Dashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' | 'form'
    const { logout, user } = useAuth();

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const { data } = await getComplaints();
            setComplaints(data.complaints || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav style={{
                height: 'var(--header-height)', borderBottom: '1px solid var(--border-strong)',
                display: 'flex', alignItems: 'center', padding: '0 2rem', background: 'var(--bg-panel)'
            }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Support Portal</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setView('list')}
                            style={{
                                background: view === 'list' ? 'var(--bg-surface)' : 'transparent',
                                border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', color: 'var(--text-main)',
                                fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500
                            }}
                        >
                            My Tickets
                        </button>
                        <button
                            onClick={() => setView('form')}
                            style={{
                                background: view === 'form' ? 'var(--bg-surface)' : 'transparent',
                                border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', color: 'var(--text-main)',
                                fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500
                            }}
                        >
                            Report Issue
                        </button>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user?.email}</span>
                    <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                        Sign Out
                    </button>
                </div>
            </nav>

            <div style={{ flex: 1, padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                {view === 'form' ? (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <ComplaintForm onSuccess={() => { setView('list'); fetchComplaints(); }} />
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My History</h1>
                            <button onClick={() => setView('form')} className="btn btn-primary">
                                <Plus size={18} /> New Ticket
                            </button>
                        </div>

                        {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading records...</p> : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {complaints.length === 0 ? (
                                    <div className="panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <p>No complaints found.</p>
                                    </div>
                                ) : complaints.map(c => (
                                    <div key={c._id} className="panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{c.category}</h3>
                                                <span className={`badge badge-${c.status === 'Resolved' ? 'resolved' : 'open'}`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{c.text.substring(0, 80)}...</p>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                                                ID: {c.trackingCode}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
