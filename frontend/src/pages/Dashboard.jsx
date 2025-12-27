import { useEffect, useState } from 'react';
import { getComplaints } from '../api/backend';
import ComplaintForm from '../components/ComplaintForm';
import { useAuth } from '../components/AuthProvider';

const Dashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'new'
    const { logout, user } = useAuth();

    const fetchComplaints = async () => {
        try {
            const { data } = await getComplaints();
            const list = data.complaints || []; // Handle new API structure
            setComplaints(list);
        } catch (err) {
            console.error('Failed to fetch complaints', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'list') {
            fetchComplaints();
        }
    }, [activeTab]);

    const getPriorityColor = (p) => {
        switch (p?.toLowerCase()) {
            case 'critical': return 'badge-critical';
            case 'high': return 'badge-high';
            case 'medium': return 'badge-medium';
            default: return 'badge-low';
        }
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="heading" style={{ margin: 0 }}>My Complaints</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome, {user?.email}</p>
                </div>
                <button onClick={logout} className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    Logout
                </button>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    className={`btn ${activeTab === 'list' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab !== 'list' ? 'var(--surface)' : undefined }}
                    onClick={() => setActiveTab('list')}
                >
                    My History
                </button>
                <button
                    className={`btn ${activeTab === 'new' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab !== 'new' ? 'var(--surface)' : undefined }}
                    onClick={() => setActiveTab('new')}
                >
                    New Complaint
                </button>
            </div>

            {activeTab === 'new' ? (
                <ComplaintForm />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : complaints.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No complaints found.</p>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setActiveTab('new')}>
                                Submit your first complaint
                            </button>
                        </div>
                    ) : (
                        complaints.map((c) => (
                            <div key={c._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ margin: 0, fontWeight: 600 }}>{c.category}</h3>
                                    <span className={`badge ${getPriorityColor(c.priority)}`}>{c.priority}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#6366f1', fontFamily: 'monospace' }}>Ref: {c.trackingCode}</div>
                                <p style={{ color: 'var(--text-gray)', margin: '0.5rem 0' }}>{c.text}</p>
                                {c.resolutionNotes && <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                    <strong>Resolution:</strong> {c.resolutionNotes}
                                </div>}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                                    <span>Status: <strong>{c.status}</strong></span>
                                    <span>Dept: {c.department}</span>
                                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
